import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    soundEffects: true,
    autoConnect: false,
    showOnlineStatus: true,
    allowMessages: true,
    dataUsage: 'medium',
    language: 'en',
    theme: 'dark'
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSelect = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Clear authentication from sessionStorage
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('selectedInterests');
      
      // Navigate to login
      navigate('/login', { replace: true });
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        try {
          const token = sessionStorage.getItem('auth_token');
          if (!token) {
            alert('Not authenticated');
            return;
          }

          const response = await fetch('http://localhost:5000/api/auth/delete-account', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            // Clear authentication from sessionStorage
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_user');
            sessionStorage.removeItem('selectedInterests');
            
            alert('Account deleted successfully');
            navigate('/login', { replace: true });
          } else {
            const data = await response.json();
            alert(data.message || 'Failed to delete account');
          }
        } catch (error) {
          console.error('Delete account error:', error);
          alert('Error deleting account: ' + error.message);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-[5%] py-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-2xl font-bold">🎭 MastiMeet</h2>
        <button 
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-[5%] py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">⚙️ Settings</h1>
          <p className="text-gray-400">Customize your MastiMeet experience</p>
        </div>

        {/* Notifications Section */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">🔔 Notifications</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Push Notifications</h4>
                <p className="text-gray-400">Receive notifications about new matches</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Email Notifications</h4>
                <p className="text-gray-400">Get updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Sound Effects</h4>
                <p className="text-gray-400">Play sounds for messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.soundEffects}
                  onChange={() => handleToggle('soundEffects')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy & Safety */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">🔒 Privacy & Safety</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Show Online Status</h4>
                <p className="text-gray-400">Let others see when you're active</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.showOnlineStatus}
                  onChange={() => handleToggle('showOnlineStatus')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Allow Direct Messages</h4>
                <p className="text-gray-400">Accept messages from any user</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.allowMessages}
                  onChange={() => handleToggle('allowMessages')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Auto Connect</h4>
                <p className="text-gray-400">Automatically connect with the next user</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.autoConnect}
                  onChange={() => handleToggle('autoConnect')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">⚡ Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-white mb-3">📊 Data Usage</label>
              <div className="space-y-2">
                {['low', 'medium', 'high'].map(option => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="dataUsage"
                      checked={settings.dataUsage === option}
                      onChange={() => handleSelect('dataUsage', option)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-lg font-semibold text-white mb-3">🌐 Language</label>
              <select 
                value={settings.language}
                onChange={(e) => handleSelect('language', e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">🗑️ Account</h2>
          <div className="space-y-3">
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold transition-colors text-left">
              📥 Download My Data
            </button>
            <button className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors text-left">
              ⚠️ Report a Problem
            </button>
            <button onClick={handleLogout} className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors text-left">
              🚪 Logout
            </button>
            <button onClick={handleDeleteAccount} className="w-full bg-red-900 hover:bg-red-800 px-6 py-3 rounded-lg font-semibold transition-colors text-left">
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
