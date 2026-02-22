import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Join from './pages/public/Join';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import VerifyEmail from './pages/public/VerifyEmail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import Guidelines from './pages/public/Guidelines';

// App Pages (Authenticated)
import InterestSelect from './pages/app/InterestSelect';
import Connecting from './pages/app/Connecting';
import FindingMatch from './pages/app/FindingMatch';
import Matched from './pages/app/Matched';
import VideoChat from './pages/app/VideoChat';
import TextChat from './pages/app/TextChat';
import Profile from './pages/app/Profile';
import Settings from './pages/app/Settings';
import AdminPanel from './pages/admin/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/guidelines" element={<Guidelines />} />

        {/* Protected Routes (After Login) */}
        <Route path="/interest-select" element={<ProtectedRoute element={<InterestSelect />} />} />
        <Route path="/connecting" element={<ProtectedRoute element={<Connecting />} />} />
        <Route path="/finding-match" element={<ProtectedRoute element={<FindingMatch />} />} />
        <Route path="/matched" element={<ProtectedRoute element={<Matched />} />} />
        <Route path="/video-chat" element={<ProtectedRoute element={<VideoChat />} />} />
        <Route path="/text-chat" element={<ProtectedRoute element={<TextChat />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} allowedRoles={["admin"]} />} />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
