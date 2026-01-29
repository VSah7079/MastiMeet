import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState('');

  const handleStartChat = () => {
    if (!selectedMode) {
      alert('Please select a chat mode');
      return;
    }
    navigate('/interest-select', { state: { mode: selectedMode } });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="px-[5%] py-6">
        <button className="bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>

      <div className="flex items-center justify-center px-[5%] py-12">
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-4xl w-full">
          <h1 className="text-5xl font-bold text-center mb-4 text-white">
            Ready to <span className="text-primary-400">Connect?</span>
          </h1>
          <p className="text-gray-400 text-center text-lg mb-12">
            Choose your preferred way to chat and meet new people
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div 
              className={`border-4 rounded-2xl p-8 cursor-pointer transition-all hover:shadow-xl ${
                selectedMode === 'video' 
                  ? 'border-primary-500 bg-gray-700 shadow-lg' 
                  : 'border-gray-600 hover:border-primary-400 bg-gray-900'
              }`}
              onClick={() => setSelectedMode('video')}
            >
              <div className="text-6xl text-center mb-4">🎥</div>
              <h3 className="text-2xl font-bold text-center mb-2 text-white">Video Chat</h3>
              <p className="text-gray-400 text-center mb-6">Face-to-face conversations</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-500">✓</span>
                  <span>Camera Required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-500">✓</span>
                  <span>Real-time Video</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-500">✓</span>
                  <span>More Personal</span>
                </div>
              </div>
            </div>

            <div 
              className={`border-4 rounded-2xl p-8 cursor-pointer transition-all hover:shadow-xl ${
                selectedMode === 'text' 
                  ? 'border-primary-500 bg-gray-700 shadow-lg' 
                  : 'border-gray-600 hover:border-primary-400 bg-gray-900'
              }`}
              onClick={() => setSelectedMode('text')}
            >
              <div className="text-6xl text-center mb-4">💬</div>
              <h3 className="text-2xl font-bold text-center mb-2 text-white">Text Chat</h3>
              <p className="text-gray-400 text-center mb-6">Anonymous text messaging</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-500">✓</span>
                  <span>No Camera Needed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-500">✓</span>
                  <span>Instant Messages</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-500">✓</span>
                  <span>Comfortable</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            className={`w-full text-lg font-bold py-5 rounded-full transition-all duration-300 ${
              selectedMode 
                ? 'bg-primary-500 text-white hover:shadow-xl hover:scale-105 hover:bg-primary-600' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleStartChat}
            disabled={!selectedMode}
          >
            Continue →
          </button>

          <div className="mt-6 p-4 bg-gray-700 rounded-xl">
            <p className="text-sm text-gray-300 text-center">
              🛡️ By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary-400 font-semibold hover:underline">Terms</a> and{' '}
              <a href="/guidelines" className="text-primary-400 font-semibold hover:underline">Community Guidelines</a>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">1M+</div>
            <div className="text-gray-400">Chats Today</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">4.8★</div>
            <div className="text-gray-400">User Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
