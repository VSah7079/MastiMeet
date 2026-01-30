import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    age: '',
    gender: '',
    bio: 'Love gaming, music, and meeting new people!',
    interests: [],
    joinDate: 'January 2026',
    totalChats: 0,
    averageRating: 0
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          setError('Not logged in');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        const userProfileData = data.user;

        // Get selected interests from localStorage
        const selectedInterests = JSON.parse(localStorage.getItem('selectedInterests') || '[]');

        // Update profile with fetched data
        setProfile(prev => ({
          ...prev,
          username: userProfileData.username || '',
          email: userProfileData.email || '',
          age: userProfileData.age || '',
          gender: userProfileData.gender || '',
          interests: selectedInterests
        }));

        setError('');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Add API call to update profile in backend
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-[5%] py-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-2xl font-bold">🎭 MastiMeet</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            ⚙️ Settings
          </button>
          <button 
            onClick={() => navigate('/interest-select')}
            className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            🎥 Start Chat
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-[5%] py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">⏳</div>
              <p className="text-xl text-gray-400">Loading profile...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-600/20 border border-red-600 rounded-2xl p-6 mb-8">
            <p className="text-red-400">⚠️ {error}</p>
          </div>
        )}

        {/* Profile Content */}
        {!loading && !error && (
        <>
        {/* Profile Header Card */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl mb-8">
          <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
          <div className="px-8 py-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-6xl border-4 border-gray-800 -mt-16">
                  👤
                </div>
                <button className="absolute bottom-0 right-0 bg-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-primary-700 transition-colors">
                  📷
                </button>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{profile.username}</h1>
                <p className="text-gray-400 mb-3">{profile.email}</p>
                <div className="flex gap-3 mb-4">
                  <span className="bg-green-600 px-4 py-1 rounded-full text-sm font-semibold">✓ Verified</span>
                  <span className="bg-green-600 px-4 py-1 rounded-full text-sm font-semibold">🟢 Active</span>
                </div>
              </div>
              <button 
                className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-full font-semibold transition-colors"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '💾 Save' : '✏️ Edit'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">📊 Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">💬</div>
              <div className="text-3xl font-bold mb-2">{profile.totalChats}</div>
              <div className="text-gray-400">Total Chats</div>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">⭐</div>
              <div className="text-3xl font-bold mb-2">{profile.averageRating}</div>
              <div className="text-gray-400">Avg Rating</div>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">📅</div>
              <div className="text-xl font-bold mb-2">{profile.joinDate}</div>
              <div className="text-gray-400">Member Since</div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">📝 Bio</h2>
          {isEditing ? (
            <textarea 
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              className="w-full h-24 bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              placeholder="Tell us about yourself"
            />
          ) : (
            <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Interests Section */}
        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">🎯 Interests</h2>
          <div className="flex flex-wrap gap-3">
            {profile.interests.map((interest, idx) => (
              <span key={idx} className="bg-primary-600 px-4 py-2 rounded-full font-semibold">
                {interest}
              </span>
            ))}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Profile;
