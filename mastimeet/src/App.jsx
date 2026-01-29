import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/public/Home';
import Join from './pages/public/Join';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import Guidelines from './pages/public/Guidelines';

// App Pages (Authenticated)
import InterestSelect from './pages/app/InterestSelect';
import VideoChat from './pages/app/VideoChat';
import TextChat from './pages/app/TextChat';
import Profile from './pages/app/Profile';
import Settings from './pages/app/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/guidelines" element={<Guidelines />} />

        {/* App Routes (After Login) */}
        <Route path="/interest-select" element={<InterestSelect />} />
        <Route path="/video-chat" element={<VideoChat />} />
        <Route path="/text-chat" element={<TextChat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
