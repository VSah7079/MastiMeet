import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { apiGet } from '../lib/api';

const ProtectedRoute = ({ element, allowedRoles = null }) => {
  const [status, setStatus] = useState('checking'); // checking, authed, unauth
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const validateSession = async () => {
      const token = sessionStorage.getItem('auth_token');
      const userStr = sessionStorage.getItem('auth_user');

      if (!token || !userStr) {
        if (isMounted) setStatus('unauth');
        return;
      }

      try {
        const data = await apiGet('/api/auth/me', token);
        if (data?.user) {
          sessionStorage.setItem('auth_user', JSON.stringify(data.user));
          if (isMounted) {
            setUser(data.user);
            setStatus('authed');
          }
        } else {
          throw new Error('Invalid session');
        }
      } catch (err) {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        if (isMounted) setStatus('unauth');
      }
    };

    validateSession();
    intervalId = setInterval(validateSession, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="text-center text-gray-300">Checking session...</div>
      </div>
    );
  }

  if (status === 'unauth') {
    return <Navigate to="/login" replace />;
  }

  const fallbackUserStr = sessionStorage.getItem('auth_user');
  const effectiveUser = user || (fallbackUserStr ? JSON.parse(fallbackUserStr) : null);

  if (!effectiveUser) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const normalizedRole = (effectiveUser.role || 'user').toLowerCase();
    const normalizedAllowed = allowedRoles.map((role) => role.toLowerCase());

    if (!normalizedAllowed.includes(normalizedRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
          <div className="bg-gray-800 rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Access Denied</h2>
            <p className="text-gray-300 text-base mb-6">
              You do not have permission to view this page.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary-500 text-white font-semibold hover:bg-primary-600 transition"
            >
              Go to Home
            </Link>
          </div>
        </div>
      );
    }
  }

  if (!effectiveUser.isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 w-full max-w-md text-center">
          <h1 className="text-5xl mb-4">📧</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Email Not Verified</h2>
          <p className="text-gray-300 text-lg mb-6">
            Please verify your email address to access this feature. Check your inbox for the verification link.
          </p>
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
            <p className="text-yellow-200 text-sm">
              If you don't see the email, check your spam folder or register again with a different email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return element;
};

export default ProtectedRoute;
