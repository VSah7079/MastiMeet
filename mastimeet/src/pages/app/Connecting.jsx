import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Connecting = () => {
  const navigate = useNavigate();
  const [dots, setDots] = useState('');
  const [status, setStatus] = useState('Establishing connection');

  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    // Auto redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      setStatus('Finding your match');
      setTimeout(() => {
        navigate('/finding-match');
      }, 1000);
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated Loader */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-32 h-32">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-400 animate-spin"></div>
            
            {/* Middle ring (reverse) */}
            <div className="absolute inset-4 rounded-full border-3 border-transparent border-b-primary-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 opacity-50 animate-pulse"></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              🔗
            </div>
          </div>
        </div>

        {/* Status Text */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {status}
          <span className="inline-block w-8 text-left">{dots}</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Connecting to server
        </p>

        {/* Progress indicators */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
            <p className="text-gray-300">Initializing connection</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <p className="text-gray-300">Loading preferences</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-primary-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <p className="text-gray-300">Preparing matchmaker</p>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-gray-800/50 border border-primary-500/30 rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-gray-300 text-sm">
            💡 <span className="font-semibold">Did you know?</span> We're connecting you with someone who shares your interests!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connecting;
