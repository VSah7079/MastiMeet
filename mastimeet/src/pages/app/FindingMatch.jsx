import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

const FindingMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatMode = location.state?.mode || sessionStorage.getItem('chatMode') || 'video';
  const [status, setStatus] = useState('connecting'); // connecting, waiting, found, error
  const [matchCount, setMatchCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Connect to socket
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('✓ Connected to server');
      setStatus('waiting');

      // Get selected interests from sessionStorage
      const selectedInterests = JSON.parse(sessionStorage.getItem('selectedInterests') || '[]');
      console.log('📌 Interests:', selectedInterests);

      // Join queue
      socketRef.current.emit('queue:join', { interests: selectedInterests });

      // Start timer
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    });

    socketRef.current.on('queue:waiting', () => {
      console.log('⏳ Waiting in queue...');
      setStatus('waiting');
    });

    socketRef.current.on('match:found', ({ roomId, partnerId }) => {
      console.log('🎉 Match found!', { roomId, partnerId });
      clearInterval(timerRef.current);
      setStatus('found');

      // Redirect to matched page after 2 seconds
      setTimeout(() => {
        navigate('/matched', { state: { roomId, partnerId, mode: chatMode } });
      }, 2000);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setStatus('error');
    });

    return () => {
      clearInterval(timerRef.current);
      if (socketRef.current) {
        socketRef.current.emit('queue:leave');
        socketRef.current.disconnect();
      }
    };
  }, [navigate]);

  const handleCancel = () => {
    if (socketRef.current) {
      socketRef.current.emit('queue:leave');
      socketRef.current.disconnect();
    }
    clearInterval(timerRef.current);
    navigate('/interest-select');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-2">
            MastiMeet
          </h1>
          <p className="text-gray-400">Finding Your Perfect Match...</p>
        </div>

        {/* Main Content */}
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-primary-500/20">
          {/* Status: Waiting */}
          {status === 'waiting' && (
            <>
              {/* Animated Loader */}
              <div className="flex justify-center mb-8">
                <div className="relative w-24 h-24">
                  {/* Outer rotating ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-400 animate-spin"></div>
                  {/* Middle rotating ring (slower) */}
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-primary-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                  {/* Inner icon */}
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    🔍
                  </div>
                </div>
              </div>

              {/* Status Text */}
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                Searching for a match...
              </h2>
              <p className="text-gray-400 text-center mb-6">
                We're looking for someone with similar interests
              </p>

              {/* Time Elapsed */}
              <div className="bg-gray-700/50 rounded-2xl p-4 mb-6 border border-primary-500/20">
                <p className="text-gray-400 text-sm text-center mb-2">Time Elapsed</p>
                <p className="text-3xl font-bold text-primary-400 text-center font-mono">
                  {formatTime(timeElapsed)}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-linear-to-br from-blue-600/30 to-blue-700/10 rounded-xl p-3 border border-blue-500/30 text-center">
                  <p className="text-gray-400 text-xs mb-1">Active Users</p>
                  <p className="text-xl font-bold text-blue-400">150+</p>
                </div>
                <div className="bg-linear-to-br from-green-600/30 to-green-700/10 rounded-xl p-3 border border-green-500/30 text-center">
                  <p className="text-gray-400 text-xs mb-1">Matches Today</p>
                  <p className="text-xl font-bold text-green-400">1,234</p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gray-700/30 rounded-xl p-4 mb-6 border border-gray-600/50">
                <p className="text-yellow-400 text-sm font-semibold mb-2">💡 Tip</p>
                <p className="text-gray-300 text-sm">
                  More specific interests = faster match. Try waiting a bit longer for a better match!
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCancel}
                  className="w-full bg-linear-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
                >
                  ❌ Cancel Search
                </button>
                
                {/* Demo Button */}
                <button
                  onClick={() => {
                    if (socketRef.current) {
                      socketRef.current.emit('queue:leave');
                      socketRef.current.disconnect();
                    }
                    clearInterval(timerRef.current);
                    // Generate random demo IDs
                    const demoRoomId = `demo_room_${Date.now()}`;
                    const demoPartnerId = `demo_user_${Math.random().toString(36).substr(2, 9)}`;
                    navigate('/matched', { state: { roomId: demoRoomId, partnerId: demoPartnerId, isDemo: true } });
                  }}
                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
                >
                  🎬 Skip to Demo Match
                </button>
              </div>
            </>
          )}

          {/* Status: Found */}
          {status === 'found' && (
            <>
              {/* Success Animation */}
              <div className="flex justify-center mb-8">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-linear-to-r from-green-500 to-emerald-500 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl animate-bounce">
                    ✨
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center text-green-400 mb-2">
                Match Found! 🎉
              </h2>
              <p className="text-gray-400 text-center mb-6">
                Starting video chat in a moment...
              </p>

              {/* Redirecting Info */}
              <div className="bg-linear-to-r from-green-600/30 to-emerald-600/30 rounded-2xl p-4 border border-green-500/30 text-center mb-6">
                <p className="text-green-400 font-semibold">Redirecting to chat...</p>
                <p className="text-gray-300 text-sm mt-2">Time waited: {formatTime(timeElapsed)}</p>
              </div>
            </>
          )}

          {/* Status: Error */}
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-8">
                <div className="text-6xl">⚠️</div>
              </div>

              <h2 className="text-2xl font-bold text-center text-red-400 mb-2">
                Connection Error
              </h2>
              <p className="text-gray-400 text-center mb-6">
                Unable to connect to matching server. Please try again.
              </p>

              <button
                onClick={() => {
                  setStatus('connecting');
                  window.location.reload();
                }}
                className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg mb-3"
              >
                🔄 Retry
              </button>
              <button
                onClick={handleCancel}
                className="w-full bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
              >
                ❌ Go Back
              </button>
            </>
          )}

          {/* Status: Connecting */}
          {status === 'connecting' && (
            <>
              <div className="flex justify-center mb-8">
                <div className="text-5xl animate-pulse">🔗</div>
              </div>
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                Connecting...
              </h2>
              <p className="text-gray-400 text-center">
                Please wait while we establish connection
              </p>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🔒 Your video and audio are completely private</p>
          <p className="mt-1">✅ No personal information is shared</p>
        </div>
      </div>
    </div>
  );
};

export default FindingMatch;
