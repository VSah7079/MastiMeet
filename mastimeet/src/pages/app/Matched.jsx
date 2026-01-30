import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Matched = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, partnerId } = location.state || {};
  
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!roomId) {
      navigate('/interest-select');
      return;
    }

    // Stop loading animation after 1 second
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Redirect to video chat
          setTimeout(() => {
            navigate('/video-chat', { state: { roomId, partnerId } });
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(countdownInterval);
    };
  }, [roomId, navigate, partnerId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Success Icon - Animated */}
        <div className="mb-12 flex justify-center">
          {isLoading ? (
            // Loading animation
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-400 animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-3 border-transparent border-b-primary-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                🔄
              </div>
            </div>
          ) : (
            // Success animation
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl animate-bounce">✨</div>
              </div>
              <div className="absolute -inset-4 rounded-full border-2 border-green-500/50 animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {isLoading ? '🎉 Match Found!' : 'Connected!'}
        </h1>
        
        <p className="text-xl text-gray-400 mb-8">
          {isLoading 
            ? 'We found the perfect match for you!' 
            : 'Starting video chat in a moment...'}
        </p>

        {/* Partner Info Card */}
        {!isLoading && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-green-500/30 mb-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-6xl mb-4">👤</div>
            <p className="text-gray-300 text-lg mb-4">Ready to chat with your match!</p>
            
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Status</p>
                <p className="text-green-400 font-bold text-lg">🟢 Online</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Type</p>
                <p className="text-blue-400 font-bold text-lg">🎥 Video</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Quality</p>
                <p className="text-purple-400 font-bold text-lg">HD</p>
              </div>
            </div>
          </div>
        )}

        {/* Countdown */}
        {!isLoading && countdown > 0 && (
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 rounded-full">
              <p className="text-white font-bold text-2xl">
                Starting in <span className="text-primary-200">{countdown}s</span>
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 bg-gray-800/50 rounded-lg p-4">
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
              <p className="text-gray-300">Setting up connection</p>
            </div>
            <div className="flex items-center justify-center gap-3 bg-gray-800/50 rounded-lg p-4">
              <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <p className="text-gray-300">Initializing video stream</p>
            </div>
            <div className="flex items-center justify-center gap-3 bg-gray-800/50 rounded-lg p-4">
              <div className="w-3 h-3 bg-primary-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <p className="text-gray-300">Preparing peer connection</p>
            </div>
          </div>
        )}

        {/* Manual Start Button */}
        {!isLoading && countdown <= 0 && (
          <button
            onClick={() => navigate('/video-chat', { state: { roomId, partnerId } })}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-12 py-4 rounded-full font-bold text-white text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            🎬 Start Video Chat
          </button>
        )}

        {/* Fun fact */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>💡 Tip: Keep camera and mic permissions enabled for smooth experience</p>
        </div>
      </div>
    </div>
  );
};

export default Matched;
