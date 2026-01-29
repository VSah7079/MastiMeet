import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add authentication logic here
    console.log('Login:', formData);
    navigate('/interest-select');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold mb-4">🎭 MastiMeet</h1>
          <p className="text-2xl text-white/90 mb-12">Welcome back! Ready to connect?</p>
        </div>

        <div className="relative w-80 h-80 mb-12">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-0 w-32 h-32 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-white/15 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl">👋</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <span className="text-3xl">✨</span>
            <span className="text-lg">Meet New People</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <span className="text-3xl">🔒</span>
            <span className="text-lg">Safe & Secure</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <span className="text-3xl">🎯</span>
            <span className="text-lg">Interest Matching</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 w-full max-w-md relative">
          <Link to="/" className="absolute top-8 right-8 text-gray-400 hover:text-gray-300 text-4xl font-light leading-none">×</Link>
          
          <h2 className="text-4xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-gray-400 mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">📧</span>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full pl-14 pr-4 py-4 border-2 border-gray-700 bg-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full pl-14 pr-14 py-4 border-2 border-gray-700 bg-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-white"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary-500 border-gray-600 bg-gray-700 rounded focus:ring-primary-500" />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-400 hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="w-full bg-primary-500 text-white font-bold text-lg py-4 rounded-xl hover:shadow-xl hover:scale-105 hover:bg-primary-600 transition-all duration-300">
              Sign In
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-400">OR</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all">
              <span className="text-2xl">🔵</span>
              <span className="font-semibold text-gray-300">Continue with Google</span>
            </button>
            <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all">
              <span className="text-2xl">📘</span>
              <span className="font-semibold text-gray-300">Continue with Facebook</span>
            </button>
          </div>

          <p className="mt-8 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 font-bold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
