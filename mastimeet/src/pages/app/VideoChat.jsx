import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoChat = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatTime, setChatTime] = useState(0);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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

  const handleEndChat = () => {
    if (confirm('Are you sure you want to end this chat?')) {
      navigate('/interest-select');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-[5%] py-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-bold">🎥 Video Chat</h2>
          {isConnected && <span className="bg-primary-500 px-4 py-2 rounded-full text-sm">⏱️ {formatTime(chatTime)}</span>}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/profile')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            👤 Profile
          </button>
          <button 
            onClick={handleEndChat}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 h-[calc(100vh-100px)]">
        {/* Video Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black rounded-lg relative overflow-hidden" style={{height: '100%'}}>
            {isConnecting ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                <div className="text-6xl mb-4 animate-bounce">👤</div>
                <p className="text-2xl font-semibold mb-2">Connecting to a partner...</p>
                <p className="text-gray-200">Finding someone interesting to chat with</p>
              </div>
            ) : isConnected ? (
              <>
                {/* Remote Video */}
                <div ref={remoteVideoRef} className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl mb-4">👥</div>
                    <p className="text-2xl font-semibold">Video Feed</p>
                  </div>
                </div>
                {/* Local Video */}
                <div ref={localVideoRef} className="absolute bottom-4 right-4 w-32 h-32 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl">🎥</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-xl">Waiting for partner...</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                isMuted 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                isVideoOff 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isVideoOff ? '📹' : '📹'}
            </button>
            <button
              onClick={handleNextPartner}
              className="bg-yellow-600 hover:bg-yellow-700 px-8 py-4 rounded-full text-lg font-semibold transition-colors"
            >
              ⏭️ Next Partner
            </button>
          </div>
        </div>

        {/* Right Sidebar - Partner Info & Chat */}
        <div className="bg-gray-800 rounded-lg p-6 overflow-y-auto flex flex-col gap-4">
          <h3 className="text-2xl font-bold mb-4">👤 Partner Info</h3>
          
          {isConnected && partnerInfo ? (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Username</p>
                <p className="text-xl font-semibold text-white">{partnerInfo.name}</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-3">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {partnerInfo.interests.map((interest, idx) => (
                    <span key={idx} className="bg-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔄</div>
              <p className="text-gray-300">Waiting for partner info...</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 mt-auto">
            <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-semibold transition-colors">
              📝 Report User
            </button>
            <button className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-semibold transition-colors">
              🚫 Block User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
