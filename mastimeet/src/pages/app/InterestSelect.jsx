import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InterestSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatMode = location.state?.mode || 'video';

  const [selectedInterests, setSelectedInterests] = useState([]);

  const interests = [
    { id: 1, emoji: '🎮', name: 'Gaming', category: 'Entertainment' },
    { id: 2, emoji: '🎵', name: 'Music', category: 'Entertainment' },
    { id: 3, emoji: '🎬', name: 'Movies', category: 'Entertainment' },
    { id: 4, emoji: '📚', name: 'Books', category: 'Knowledge' },
    { id: 5, emoji: '⚽', name: 'Sports', category: 'Lifestyle' },
    { id: 6, emoji: '🍕', name: 'Food', category: 'Lifestyle' },
    { id: 7, emoji: '✈️', name: 'Travel', category: 'Lifestyle' },
    { id: 8, emoji: '🎨', name: 'Art', category: 'Creative' },
    { id: 9, emoji: '📸', name: 'Photography', category: 'Creative' },
    { id: 10, emoji: '💻', name: 'Technology', category: 'Knowledge' },
    { id: 11, emoji: '🧘', name: 'Fitness', category: 'Lifestyle' },
    { id: 12, emoji: '🐶', name: 'Pets', category: 'Lifestyle' },
    { id: 13, emoji: '🎭', name: 'Theatre', category: 'Entertainment' },
    { id: 14, emoji: '🎤', name: 'Singing', category: 'Creative' },
    { id: 15, emoji: '💃', name: 'Dancing', category: 'Creative' },
    { id: 16, emoji: '🍳', name: 'Cooking', category: 'Lifestyle' },
    { id: 17, emoji: '🌱', name: 'Nature', category: 'Lifestyle' },
    { id: 18, emoji: '🚗', name: 'Cars', category: 'Hobby' },
    { id: 19, emoji: '🎯', name: 'Business', category: 'Knowledge' },
    { id: 20, emoji: '💪', name: 'Motivation', category: 'Lifestyle' },
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.find(i => i.id === interest.id)) {
      setSelectedInterests(selectedInterests.filter(i => i.id !== interest.id));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleStartChat = () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }
    
    // Save interests to sessionStorage
    sessionStorage.setItem('selectedInterests', JSON.stringify(selectedInterests.map(i => i.name)));
    sessionStorage.setItem('chatMode', chatMode);
    
    // Navigate to connecting page (then auto to finding match)
    navigate('/connecting', { state: { mode: chatMode } });
  };

  const groupedInterests = interests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <button className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-white/30 transition-colors mb-8" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="text-5xl font-bold text-white text-center mb-4">Select Your Interests</h1>
        <p className="text-xl text-white/90 text-center mb-2">
          Choose topics you're interested in to match with like-minded people
        </p>
        <div className="text-center text-2xl font-bold text-yellow-300 mb-12">
          {selectedInterests.length} selected
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 mb-24">
        {Object.entries(groupedInterests).map(([category, categoryInterests]) => (
          <div key={category} className="bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6">{category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categoryInterests.map((interest) => (
                <button
                  key={interest.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedInterests.find(i => i.id === interest.id) 
                      ? 'border-primary-500 bg-gray-700 shadow-lg scale-105' 
                      : 'border-gray-600 bg-gray-700 hover:border-primary-300 hover:shadow-md'
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  <span className="text-4xl block mb-2">{interest.emoji}</span>
                  <span className="text-sm font-semibold text-white block">{interest.name}</span>
                  {selectedInterests.find(i => i.id === interest.id) && (
                    <span className="absolute top-2 right-2 bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className={`text-lg font-bold py-4 px-12 rounded-full transition-all duration-300 ${
              selectedInterests.length > 0 
                ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-xl hover:scale-105' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleStartChat}
            disabled={selectedInterests.length === 0}
          >
            🎥 Find Your Match →
          </button>
          <button className="text-lg font-bold py-4 px-12 rounded-full bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 transition-all" onClick={() => handleStartChat()}>
            Skip & Random Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestSelect;
