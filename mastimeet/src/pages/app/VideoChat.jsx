import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoChat = () => {
  const navigate = useNavigate();
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

  // Current user data (from localStorage or auth context)
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

  useEffect(() => {
    // Simulate connecting to a partner
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setPartnerInfo({
        name: 'Random User',
        interests: ['Gaming', 'Music', 'Travel']
      });
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, []);

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

  const handleNextPartner = () => {
    setIsConnected(false);
    setIsConnecting(true);
    setChatTime(0);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
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
      stopCamera();
      navigate('/interest-select');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header with Gradient */}
      <div className="bg-linear-to-r from-gray-800 to-primary-900/50 px-[5%] py-4 flex justify-between items-center border-b border-primary-500/20 shadow-lg">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">🎥 Video Chat</h2>
          {isConnected && <span className="bg-linear-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">⏱️ {formatTime(chatTime)}</span>}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/profile')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all hover:scale-105 font-semibold"
          >
            👤 Profile
          </button>
          <button 
            onClick={handleEndChat}
            className="bg-linear-to-r from-red-600 to-red-700 hover:shadow-lg px-4 py-2 rounded-lg transition-all hover:scale-105 font-semibold"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="h-[calc(100vh-100px)] bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden flex flex-col">
        
        {/* Connected State - Full Screen Layout */}
        {isConnected && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4 p-3 md:p-4">
            {/* Main Video - Partner (Takes 3/4 on desktop) */}
            <div className="lg:col-span-3 relative rounded-3xl overflow-hidden shadow-2xl group">
              {/* Video Background */}
              <div className="w-full h-full bg-linear-to-b from-black to-gray-900 flex items-center justify-center relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                  <div>
                    <div className="text-9xl md:text-9xl mb-6 animate-pulse drop-shadow-lg">👥</div>
                    <p className="text-2xl md:text-4xl font-bold text-primary-300 mb-2">Partner's Video</p>
                    <p className="text-gray-400">Waiting for stream...</p>
                  </div>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-primary-500/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-linear-to-tl from-primary-500/20 to-transparent rounded-full blur-3xl"></div>

                {/* Local Video - Picture in Picture (Top Right) */}
                <div className="absolute top-4 right-4 w-24 md:w-32 lg:w-40 h-24 md:h-32 lg:h-40 rounded-2xl overflow-hidden border-4 border-primary-500 shadow-2xl bg-black group-hover:scale-105 transition-transform duration-300">
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
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl md:text-4xl">📹</div>
                  )}
                </div>

                {/* Chat Duration Badge */}
                <div className="absolute top-4 left-4 bg-linear-to-r from-primary-600/90 to-primary-700/90 backdrop-blur px-4 md:px-6 py-2 md:py-3 rounded-full text-white font-bold text-sm md:text-lg shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  ⏱️ {formatTime(chatTime)}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Partner Info (Takes 1/4 on desktop) */}
            <div className="lg:col-span-1 flex flex-col gap-3 md:gap-4">
              {/* Partner Info Card */}
              <div className="bg-linear-to-br from-gray-700/80 to-gray-800/80 backdrop-blur rounded-2xl p-4 md:p-6 border border-primary-500/30 shadow-xl flex-1 overflow-y-auto">
                <div className="text-center mb-4">
                  <div className="text-5xl md:text-6xl mb-3">👤</div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">{partnerInfo?.name}</h3>
                  <p className="text-green-400 text-sm font-semibold">🟢 Online</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-linear-to-br from-yellow-600/30 to-yellow-700/30 rounded-lg p-2 md:p-3 border border-yellow-500/30 text-center">
                    <p className="text-xl md:text-2xl mb-1">⭐</p>
                    <p className="text-gray-300 text-xs md:text-sm">4.8</p>
                  </div>
                  <div className="bg-linear-to-br from-green-600/30 to-green-700/30 rounded-lg p-2 md:p-3 border border-green-500/30 text-center">
                    <p className="text-xl md:text-2xl mb-1">✅</p>
                    <p className="text-gray-300 text-xs md:text-sm">Verified</p>
                  </div>
                </div>

                {/* Interests */}
                <div className="mb-4">
                  <p className="text-gray-400 text-xs md:text-sm mb-2 font-semibold uppercase">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {partnerInfo?.interests.map((interest, idx) => (
                      <span key={idx} className="bg-linear-to-r from-primary-600 to-primary-500 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg hover:scale-110 transition-transform">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 hidden md:block">
                  <button className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all transform hover:scale-105 shadow-lg">
                    🚫 Report
                  </button>
                  <button className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-3 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all transform hover:scale-105 shadow-lg">
                    🚫 Block
                  </button>
                </div>
              </div>

              {/* Call Controls - Vertical on Desktop */}
              <div className="hidden lg:flex flex-col gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-full py-3 rounded-full flex items-center justify-center text-lg font-bold transition-all transform hover:scale-105 shadow-lg ${
                    isMuted 
                      ? 'bg-linear-to-r from-red-600 to-red-700 hover:shadow-red-900' 
                      : 'bg-linear-to-r from-primary-600 to-primary-700 hover:shadow-primary-900'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : '🎤'}
                </button>
                <button
                  onClick={handleNextPartner}
                  className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  ⏭️ Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Connecting State - Full Screen */}
        {isConnecting && !isConnected && (
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="relative">
              {/* Animated Rings */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin" style={{width: '120px', height: '120px', animationDuration: '3s'}}></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-primary-300 animate-spin" style={{width: '80px', height: '80px', animationDuration: '2s', animationDirection: 'reverse'}}></div>
              
              {/* Center Icon */}
              <div className="relative w-20 h-20 flex items-center justify-center text-6xl animate-pulse">
                👤
              </div>
            </div>
            
            <p className="text-3xl md:text-4xl font-bold mt-8 mb-2 text-center">Finding Your Match...</p>
            <p className="text-gray-300 text-lg md:text-xl mb-6">Connecting you with someone interesting</p>
            
            {/* Animated Dots */}
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-linear-to-r from-primary-400 to-primary-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-3 h-3 bg-linear-to-r from-primary-400 to-primary-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-linear-to-r from-primary-400 to-primary-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>

            {/* Local Preview أثناء Connecting */}
            <div className="absolute bottom-4 right-4 w-24 md:w-32 lg:w-40 h-24 md:h-32 lg:h-40 rounded-2xl overflow-hidden border-4 border-primary-500 shadow-2xl bg-black">
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
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl md:text-4xl">📹</div>
              )}
            </div>
          </div>
        )}

        {/* Controls Bar - Bottom (Mobile & Tablet) */}
        {isConnected && (
          <div className="lg:hidden bg-linear-to-t from-gray-900 via-gray-900/80 to-transparent p-4 flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all transform hover:scale-110 font-bold shadow-lg ${
                isMuted 
                  ? 'bg-linear-to-r from-red-600 to-red-700' 
                  : 'bg-linear-to-r from-primary-600 to-primary-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
            <button
              onClick={handleNextPartner}
              className="bg-linear-to-r from-yellow-500 to-yellow-600 px-6 py-3 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              ⏭️ Next
            </button>
            <button
              onClick={handleEndChat}
              className="bg-linear-to-r from-red-600 to-red-700 px-6 py-3 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              ❌ End
            </button>
          </div>
        )}
      </div>

      {/* Desktop End Button - Bottom Right */}
      {isConnected && (
        <button
          onClick={handleEndChat}
          className="hidden lg:fixed lg:bottom-24 lg:right-6 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
        >
          ❌ End Chat
        </button>
      )}

      {/* Non-Connected State - Old Layout */}
      {!isConnected && !isConnecting && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 flex-1">
          {/* Video Section */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Local Video - Always Show */}
            <div className="bg-linear-to-b from-black to-gray-900 rounded-2xl relative overflow-hidden shadow-2xl flex-1">
              {cameraLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                  <div className="text-6xl mb-4 animate-pulse">📹</div>
                  <p className="text-xl md:text-2xl font-semibold mb-2">Initializing Camera...</p>
                  <p className="text-gray-400 text-sm md:text-base">Please allow camera access</p>
                </div>
              ) : !cameraPermission ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                  <div className="text-6xl mb-4">🚫</div>
                  <p className="text-xl md:text-2xl font-semibold mb-2">Camera Access Denied</p>
                  <p className="text-gray-400 text-sm md:text-base">Please enable camera permissions to continue</p>
                </div>
              ) : null}
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl transition-all transform hover:scale-110 font-bold shadow-lg ${
                  isMuted 
                    ? 'bg-linear-to-r from-red-600 to-red-700 hover:shadow-red-900' 
                    : 'bg-linear-to-r from-primary-600 to-primary-700 hover:shadow-primary-900'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇' : '🎤'}
              </button>
              <button
                onClick={handleEndChat}
                className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                ❌ End
              </button>
            </div>
          </div>

          {/* Right Sidebar - Partner Info & Actions */}
          <div className="bg-linear-to-b from-gray-800 to-gray-900 rounded-2xl p-4 md:p-6 overflow-y-auto flex flex-col gap-4 border border-primary-500/20 shadow-xl">
            <h3 className="text-xl md:text-2xl font-bold bg-linear-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-2">👤 Partner Info</h3>
            
            <div className="text-center py-8">
              <div className="text-5xl mb-2 animate-bounce">🔄</div>
              <p className="text-sm md:text-base text-gray-300 font-semibold">Waiting for partner...</p>
              <p className="text-gray-400 text-xs md:text-sm mt-2">Getting someone ready to chat</p>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Widget - Bottom Right Corner */}
      <div className={`fixed bottom-4 md:bottom-6 right-4 md:right-6 transition-all duration-300 ease-in-out z-50 ${
        isUserProfileExpanded ? 'w-full md:w-96 max-w-sm' : 'w-16 md:w-20'
      }`}>
        {/* Collapsed State - Small Icon */}
        {!isUserProfileExpanded && (
          <button
            onClick={() => setIsUserProfileExpanded(true)}
            className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-linear-to-br from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-2xl flex items-center justify-center text-3xl md:text-4xl hover:scale-110 transition-transform border-4 border-primary-400 cursor-pointer hover:shadow-primary-500/50"
            title="Show profile"
          >
            {currentUser.avatar}
          </button>
        )}

        {/* Expanded State - Full Profile Card */}
        {isUserProfileExpanded && (
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-primary-500/30 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setIsUserProfileExpanded(false)}
              className="absolute top-3 right-3 text-2xl hover:scale-110 transition-transform"
              title="Close profile"
            >
              ✕
            </button>

            {/* Profile Header */}
            <div className="bg-linear-to-r from-primary-600 to-primary-700 p-4 md:p-6 text-center">
              <div className="text-5xl md:text-6xl mb-3">{currentUser.avatar}</div>
              <h3 className="text-xl md:text-2xl font-bold text-white">{currentUser.name}</h3>
              <p className="text-primary-100 text-sm md:text-base">@{currentUser.username}</p>
            </div>

            {/* Status & Info */}
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3 md:p-4 border border-primary-500/20">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🟢</span>
                  <p className="text-gray-300 font-semibold">Status</p>
                </div>
                <p className="text-primary-400 font-bold">{currentUser.status}</p>
              </div>

              {/* Rating & Verification */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-yellow-700/30 rounded-lg p-3 md:p-4 border border-yellow-500/30 text-center">
                  <p className="text-2xl md:text-3xl mb-1">⭐</p>
                  <p className="text-gray-300 text-xs md:text-sm">Rating</p>
                  <p className="text-yellow-400 font-bold text-sm md:text-base">{currentUser.rating}</p>
                </div>
                <div className="bg-green-700/30 rounded-lg p-3 md:p-4 border border-green-500/30 text-center">
                  <p className="text-2xl md:text-3xl mb-1">✅</p>
                  <p className="text-gray-300 text-xs md:text-sm">Verified</p>
                  <p className="text-green-400 font-bold text-sm md:text-base">{currentUser.verified ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 md:pt-4 space-y-2">
                <button className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base text-white transition-all transform hover:scale-105 shadow-lg">
                  ⚙️ Settings
                </button>
                <button onClick={() => navigate('/profile')} className="w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-4 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base text-white transition-all transform hover:scale-105 shadow-lg">
                  📋 View Profile
                </button>
                <button onClick={handleLogout} className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base text-white transition-all transform hover:scale-105 shadow-lg">
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoChat;
