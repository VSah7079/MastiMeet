import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost, apiGet } from '../../lib/api';

const Register = () => {
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    const validateExistingSession = async () => {
      const token = sessionStorage.getItem('auth_token');
      if (!token) return;

      try {
        const data = await apiGet('/api/auth/me', token);
        if (data?.user) {
          sessionStorage.setItem('auth_user', JSON.stringify(data.user));
          navigate('/interest-select', { replace: true });
        } else {
          throw new Error('Invalid session');
        }
      } catch (err) {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
      }
    };

    validateExistingSession();
  }, [navigate]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const levels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500'];
    return { strength, label: levels[strength], color: colors[strength] };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 18) {
      newErrors.age = 'You must be 18 or older';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Please agree to terms and conditions';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setError('');
    setErrors({});
    setLoading(true);

    try {
      const data = await apiPost('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender
      });

      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem('auth_user', JSON.stringify(data.user));

      navigate('/interest-select');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md mb-12">
          <h1 className="text-6xl font-bold mb-4">🎭 MastiMeet</h1>
          <p className="text-2xl text-white/90">Join thousands of people making connections!</p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12 w-full max-w-lg">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-sm text-white/80">Active Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold mb-2">1M+</div>
            <div className="text-sm text-white/80">Daily Chats</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold mb-2">150+</div>
            <div className="text-sm text-white/80">Countries</div>
          </div>
        </div>

        <div className="space-y-6 w-full max-w-lg">
          <h3 className="text-3xl font-bold mb-6">Why Join MastiMeet?</h3>
          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <span className="text-4xl">✨</span>
            <div>
              <h4 className="text-xl font-bold mb-1">Meet New People</h4>
              <p className="text-white/80">Connect with interesting people worldwide</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <span className="text-4xl">🎯</span>
            <div>
              <h4 className="text-xl font-bold mb-1">Interest Matching</h4>
              <p className="text-white/80">Find people who share your passions</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <span className="text-4xl">🔒</span>
            <div>
              <h4 className="text-xl font-bold mb-1">Safe & Private</h4>
              <p className="text-white/80">Your privacy is our top priority</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900 overflow-y-auto">
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 w-full max-w-2xl relative my-8">
          <Link to="/" className="absolute top-8 right-8 text-gray-400 hover:text-gray-300 text-4xl font-light leading-none">×</Link>
          
          <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 mb-8">Sign up to start chatting</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">👤</span>
                  <input
                    type="text"
                    id="username"
                    placeholder="Choose username"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({...formData, username: e.target.value});
                      setErrors({...errors, username: ''});
                    }}
                    required
                    className={`w-full pl-14 pr-4 py-4 border-2 bg-gray-700 rounded-xl focus:outline-none transition-colors text-white ${
                      errors.username ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary-500'
                    }`}
                  />
                </div>
                {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">📧</span>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      setErrors({...errors, email: ''});
                    }}
                    required
                    className={`w-full pl-14 pr-4 py-4 border-2 bg-gray-700 rounded-xl focus:outline-none transition-colors text-white ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-300 mb-2">Age</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🎂</span>
                  <input
                    type="number"
                    id="age"
                    placeholder="18+"
                    min="18"
                    value={formData.age}
                    onChange={(e) => {
                      setFormData({...formData, age: e.target.value});
                      setErrors({...errors, age: ''});
                    }}
                    required
                    className={`w-full pl-14 pr-4 py-4 border-2 bg-gray-700 rounded-xl focus:outline-none transition-colors text-white ${
                      errors.age ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary-500'
                    }`}
                  />
                </div>
                {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-300 mb-2">Gender</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">⚧</span>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => {
                      setFormData({...formData, gender: e.target.value});
                      setErrors({...errors, gender: ''});
                    }}
                    required
                    className={`w-full pl-14 pr-4 py-4 border-2 bg-gray-700 rounded-xl focus:outline-none transition-colors appearance-none text-white ${
                      errors.gender ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary-500'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                </div>
                {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Create strong password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    setErrors({...errors, password: ''});
                  }}
                  required
                  className={`w-full pl-14 pr-14 py-4 border-2 bg-gray-700 rounded-xl focus:outline-none transition-colors text-white ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary-500'
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Strength:</span>
                    <span className={`font-semibold ${getPasswordStrength(formData.password).color}`}>
                      {getPasswordStrength(formData.password).label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                    <div 
                      className="h-1 rounded-full transition-all" 
                      style={{
                        width: `${(getPasswordStrength(formData.password).strength / 5) * 100}%`,
                        backgroundColor: getPasswordStrength(formData.password).color.replace('text-', '').split('-')[0] === 'red' ? '#ef4444' : 
                                       getPasswordStrength(formData.password).color.replace('text-', '').split('-')[0] === 'orange' ? '#f97316' :
                                       getPasswordStrength(formData.password).color.replace('text-', '').split('-')[0] === 'yellow' ? '#eab308' :
                                       getPasswordStrength(formData.password).color.replace('text-', '').split('-')[0] === 'lime' ? '#84cc16' : '#22c55e'
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({...formData, confirmPassword: e.target.value});
                    setErrors({...errors, confirmPassword: ''});
                  }}
                  required
                  className={`w-full pl-14 pr-4 py-4 border-2 bg-gray-700 rounded-xl focus:outline-none transition-colors text-white ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-primary-500'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              {formData.password && formData.confirmPassword === formData.password && (
                <p className="text-green-400 text-sm mt-1">✓ Passwords match</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => {
                  setFormData({...formData, agreeTerms: e.target.checked});
                  setErrors({...errors, agreeTerms: ''});
                }}
                required
                className="mt-1 w-5 h-5 text-primary-400 border-gray-600 bg-gray-700 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-300">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-primary-400 font-semibold hover:underline">Terms & Conditions</Link>
                {' '}and{' '}
                <Link to="/privacy" target="_blank" className="text-primary-400 font-semibold hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-red-400 text-sm">{errors.agreeTerms}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white font-bold text-lg py-4 rounded-xl hover:shadow-xl hover:scale-105 hover:bg-primary-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div>
            <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all">
              <span className="text-2xl">🔵</span>
              <span className="font-semibold text-gray-300">Sign up with Google</span>
            </button>
          </div>

          <p className="mt-8 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
