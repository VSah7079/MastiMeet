import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');

  // Check if user is authenticated
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  // Check if email is verified
  try {
    const user = JSON.parse(userStr);
    if (!user.isEmailVerified) {
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
  } catch (err) {
    console.error('Error parsing user data:', err);
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
