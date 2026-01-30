import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../../lib/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const data = await apiPost('/api/auth/verify-email', { token });
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Email verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 w-full max-w-md text-center">
        <h1 className="text-5xl mb-4">
          {status === 'verifying' && '⏳'}
          {status === 'success' && '✅'}
          {status === 'error' && '❌'}
        </h1>

        <h2 className="text-3xl font-bold text-white mb-4">
          {status === 'verifying' && 'Verifying Email'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h2>

        <p className="text-gray-300 text-lg mb-8">
          {message}
        </p>

        {status === 'success' && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
            <p className="text-green-200">
              Your account is now fully activated. Redirecting to login...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-200">
                {message}
              </p>
            </div>
            <div className="space-y-2">
              <Link 
                to="/register" 
                className="block w-full bg-primary-500 text-white font-bold py-3 rounded-xl hover:bg-primary-600 transition-colors"
              >
                Try Registering Again
              </Link>
              <Link 
                to="/" 
                className="block w-full bg-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )}

        {status === 'verifying' && (
          <div className="flex justify-center">
            <div className="animate-spin">
              <div className="text-6xl">🔄</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
