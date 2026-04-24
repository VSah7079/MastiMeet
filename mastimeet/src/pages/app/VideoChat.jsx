import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const VideoChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingRoomId = location.state?.roomId || null;
  const incomingPartnerId = location.state?.partnerId || null;
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [chatTime, setChatTime] = useState(0);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [isUserProfileExpanded, setIsUserProfileExpanded] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const roomIdRef = useRef(null);

  // Current user data (from sessionStorage or auth context)
  const currentUser = {
    name: 'You',
    username: 'user_123',
    avatar: '👤',
    status: 'Online',
    rating: 4.9,
    verified: true
  };

  // Request camera permission and start stream
  useEffect(() => {
    startCamera();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (localVideoRef.current && mediaStreamRef.current) {
      localVideoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [cameraPermission, cameraLoading, isConnecting, isConnected]);

  // Socket.io connection and WebRTC setup
  useEffect(() => {
    // Connect to backend socket server
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('Connected to signaling server');

      if (incomingRoomId) {
        roomIdRef.current = incomingRoomId;
        setPartnerInfo((prev) => prev || {
          name: incomingPartnerId ? `User ${incomingPartnerId.slice(0, 4)}` : 'Chat Partner',
          interests: []
        });
        socketRef.current.emit('room:join-existing', { roomId: incomingRoomId });
        return;
      }

      // Fallback flow: join queue if page is opened directly.
      const userInterests = JSON.parse(sessionStorage.getItem('selectedInterests') || '[]');
      socketRef.current.emit('queue:join', { interests: userInterests });
    });

    socketRef.current.on('room:joined', ({ roomId, participantCount }) => {
      roomIdRef.current = roomId;
      setIsConnecting(participantCount < 2);
    });

    socketRef.current.on('room:ready', async ({ roomId, participantIds = [] }) => {
      const localId = socketRef.current?.id;
      if (!localId) return;

      roomIdRef.current = roomId;
      const sortedParticipants = [...participantIds].sort();
      const isInitiator = sortedParticipants[0] === localId;
      await createPeerConnection(roomId, isInitiator);
    });

    socketRef.current.on('queue:waiting', (data) => {
      console.log('Waiting in queue:', data);
      setIsConnecting(true);
      setIsConnected(false);
    });

    socketRef.current.on('match:found', async ({ roomId, partnerId, partnerInterests }) => {
      console.log('Match found!', { roomId, partnerId });
      roomIdRef.current = roomId;
      const localId = socketRef.current?.id;
      const isInitiator = localId && partnerId ? localId < partnerId : true;

      setPartnerInfo({
        name: partnerId ? `User ${partnerId.slice(0, 4)}` : 'Random User',
        interests: partnerInterests || ['Gaming', 'Music', 'Travel']
      });
      
      // Create peer connection; only initiator sends offer
      await createPeerConnection(roomId, isInitiator);
    });

    socketRef.current.on('signal:offer', async ({ offer, roomId }) => {
      console.log('Received offer');
      if (!peerConnectionRef.current) {
        await createPeerConnection(roomId, false);
      }
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit('signal:answer', { answer, roomId });
    });

    socketRef.current.on('signal:answer', async ({ answer }) => {
      console.log('Received answer');
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      setIsConnecting(false);
      setIsConnected(true);
    });

    socketRef.current.on('signal:ice', async ({ candidate }) => {
      console.log('Received ICE candidate');
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketRef.current.on('partner:disconnected', () => {
      console.log('Partner disconnected');
      closePeerConnection();
      setIsConnected(false);
      setIsConnecting(false);
      setPartnerInfo(null);
    });

    return () => {
      if (socketRef.current) {
        if (!incomingRoomId) {
          socketRef.current.emit('queue:leave');
        }
        socketRef.current.disconnect();
      }
      closePeerConnection();
    };
  }, [incomingPartnerId, incomingRoomId]);

  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        setChatTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const createPeerConnection = async (roomId, isInitiator) => {
    try {
      // Avoid creating multiple peer connections
      if (peerConnectionRef.current) {
        console.log('Peer connection already exists');
        return;
      }

      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };

      peerConnectionRef.current = new RTCPeerConnection(configuration);

      // Add local stream tracks to peer connection
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, mediaStreamRef.current);
        });
      }

      // Handle incoming remote stream
      remoteStreamRef.current = new MediaStream();
      peerConnectionRef.current.ontrack = (event) => {
        console.log('Received remote track');
        event.streams[0].getTracks().forEach(track => {
          remoteStreamRef.current.addTrack(track);
        });
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }
        setIsConnecting(false);
        setIsConnected(true);
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate');
          socketRef.current.emit('signal:ice', { candidate: event.candidate, roomId });
        }
      };

      // Monitor connection state
      peerConnectionRef.current.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnectionRef.current.connectionState);
        if (peerConnectionRef.current.connectionState === 'disconnected' || 
            peerConnectionRef.current.connectionState === 'failed') {
          closePeerConnection();
          setIsConnected(false);
        }
      };

      // If initiator, create and send offer
      if (isInitiator) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socketRef.current.emit('signal:offer', { offer, roomId });
      }
    } catch (error) {
      console.error('Error creating peer connection:', error);
    }
  };

  const closePeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop());
      remoteStreamRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleNextPartner = () => {
    closePeerConnection();
    setIsConnected(false);
    setIsConnecting(true);
    setChatTime(0);
    setPartnerInfo(null);
    roomIdRef.current = null;
    
    // Rejoin the queue
    if (socketRef.current) {
      const userInterests = JSON.parse(sessionStorage.getItem('selectedInterests') || '[]');
      socketRef.current.emit('queue:join', { interests: userInterests });
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraPermission(false);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    try {
      setCameraLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      mediaStreamRef.current = stream;
      setCameraPermission(true);
      setCameraLoading(false);
    } catch (error) {
      console.log('Camera permission denied or not available:', error);
      setCameraPermission(false);
      setCameraLoading(false);
    }
  };

  const handleEndChat = () => {
    if (confirm('Are you sure you want to end this chat?')) {
      // Stop all camera and microphone tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          track.enabled = false;
          track.stop();
        });
        mediaStreamRef.current = null;
      }
      
      // Close peer connection and remote stream
      closePeerConnection();
      
      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.emit('queue:leave');
        socketRef.current.disconnect();
      }
      
      // Stop camera UI
      stopCamera();
      
      // Navigate to home page
      navigate('/', { replace: true });
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Stop media streams
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          track.enabled = false;
          track.stop();
        });
        mediaStreamRef.current = null;
      }
      
      // Close peer connection
      closePeerConnection();
      
      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.emit('queue:leave');
        socketRef.current.disconnect();
      }
      
      // Clear authentication from sessionStorage
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('selectedInterests');
      
      // Navigate to login
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Premium Header */}
      <div className="relative z-10 bg-linear-to-r from-slate-800/80 via-purple-800/80 to-slate-800/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 shadow-2xl">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎥</div>
            <div>
              <h1 className="text-3xl font-black bg-linear-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">MastiMeet</h1>
              <p className="text-xs text-purple-300">Video Connect</p>
            </div>
          </div>

          {isConnected && (
            <div className="flex items-center gap-3 bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-full px-6 py-2 backdrop-blur">
              <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></span>
              <span className="font-bold text-lg">{formatTime(chatTime)}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/profile')}
              className="hidden sm:flex items-center gap-2 bg-linear-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 font-semibold"
            >
              👤 <span className="hidden md:inline">Profile</span>
            </button>
            <button 
              onClick={handleEndChat}
              className="bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 font-bold"
            >
              ✕ <span className="hidden sm:inline">End</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="relative z-0 h-[calc(100vh-92px)] flex items-center justify-center p-0">
        
        {/* Connected State - Monkey Style Full Screen */}
        {isConnected && (
          <div className="w-full h-full relative">
            {/* Full Screen Video */}
            <div className="w-full h-full relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Video Fallback */}
              <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center text-center pointer-events-none">
                <div className="space-y-6">
                  <div className="text-8xl animate-bounce">🎥</div>
                  <p className="text-3xl font-bold text-transparent bg-linear-to-r from-purple-300 to-pink-300 bg-clip-text">Partner's Stream</p>
                  <p className="text-gray-400 text-lg">Waiting for video...</p>
                </div>
              </div>

              {/* Corner Accent Lines */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500"></div>

              {/* Top Left - My Video (Monkey Style PIP) */}
              <div className="absolute top-6 left-6 w-24 h-32 rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-slate-900 ring-2 ring-purple-400/50">
                {cameraPermission ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-4xl">📹</div>
                )}
              </div>

              {/* Top Right - Partner Info Card (Minimal) */}
              <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">👤</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{partnerInfo?.name}</h3>
                    <p className="text-sm text-emerald-400 font-semibold">🟢 Online</p>
                  </div>
                </div>
              </div>

              {/* Center - Floating Action Buttons (Monkey Style) */}
              <div className="absolute inset-0 flex items-center justify-center pointerEvents-none">
                <div className="flex gap-6">
                  {/* Pass Button */}
                  <button
                    onClick={handleNextPartner}
                    className="w-20 h-20 rounded-full bg-red-500/80 hover:bg-red-600 shadow-2xl flex items-center justify-center text-4xl transition-all hover:scale-110 backdrop-blur pointer-events-auto"
                    title="Pass"
                  >
                    ❌
                  </button>
                  
                  {/* Like Button */}
                  <button
                    onClick={() => {}}
                    className="w-20 h-20 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-2xl flex items-center justify-center text-4xl transition-all hover:scale-110 backdrop-blur pointer-events-auto"
                    title="Like"
                  >
                    ❤️
                  </button>
                </div>
              </div>

              {/* Bottom Left - Call Duration */}
              <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="font-bold text-lg">{formatTime(chatTime)}</span>
              </div>

              {/* Bottom - Call Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                {/* Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 backdrop-blur ${
                    isMuted 
                      ? 'bg-red-500/80 hover:bg-red-600' 
                      : 'bg-slate-700/80 hover:bg-slate-600'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : '🎤'}
                </button>

                {/* End Call Button */}
                <button
                  onClick={handleEndChat}
                  className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-700 shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 backdrop-blur"
                  title="End Call"
                >
                  📞
                </button>
              </div>

              {/* Bottom Right - Quick Reaction Menu */}
              <div className="absolute bottom-8 right-8 flex flex-col gap-3">
                <button className="w-14 h-14 rounded-full bg-yellow-400/80 hover:bg-yellow-500 shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110 backdrop-blur" title="Haha">😂</button>
                <button className="w-14 h-14 rounded-full bg-red-400/80 hover:bg-red-500 shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110 backdrop-blur" title="Love">💕</button>
              </div>
            </div>
          </div>
        )}

        {/* Connecting State - Monkey Style Loader */}
        {isConnecting && !isConnected && (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            {/* Animated Matching Rings */}
            <div className="relative w-40 h-40 mb-12">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="absolute inset-8 rounded-full border-4 border-transparent border-b-purple-400 border-l-pink-400 animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-7xl animate-pulse">🐵</div>
              </div>
            </div>
            
            {/* Text */}
            <div className="text-center space-y-4 mb-12">
              <p className="text-5xl font-bold bg-linear-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Finding Match</p>
              <p className="text-lg text-gray-300">Hold tight... amazing people loading!</p>
            </div>
            
            {/* Animated Dots */}
            <div className="flex gap-3 mb-12">
              <div className="w-3 h-3 bg-linear-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{animationDelay: '0s'}}></div>
              <div className="w-3 h-3 bg-linear-to-r from-pink-400 to-purple-400 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-linear-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{animationDelay: '0.4s'}}></div>
            </div>

            {/* Local Preview PIP */}
            <div className="absolute bottom-12 left-8 w-28 h-36 rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-slate-900 ring-2 ring-purple-400/50">
              {cameraPermission ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-4xl">📹</div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Controls - Bottom Bar (Monkey Style) */}
        {isConnected && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/80 to-transparent pt-8 pb-8 px-4 flex gap-3 justify-center">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 backdrop-blur ${
                isMuted 
                  ? 'bg-red-500/80 hover:bg-red-600' 
                  : 'bg-slate-700/80 hover:bg-slate-600'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>

            <button
              onClick={handleNextPartner}
              className="w-16 h-16 rounded-full bg-red-500/80 hover:bg-red-600 shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 backdrop-blur"
              title="Pass"
            >
              ❌
            </button>

            <button
              onClick={() => {}}
              className="w-16 h-16 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 backdrop-blur"
              title="Like"
            >
              ❤️
            </button>

            <button
              onClick={handleEndChat}
              className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-700 shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 backdrop-blur"
              title="End Call"
            >
              📞
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoChat;
