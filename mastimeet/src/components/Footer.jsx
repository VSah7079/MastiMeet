import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-[5%]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">🎭 MastiMeet</h3>
            <p className="text-gray-400">
              Connect with strangers worldwide through random video and text chats. Safe, fun, and instant!
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <span>📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <span>🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <span>📷</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/guidelines" className="text-gray-400 hover:text-primary-400 transition-colors">Community Guidelines</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/join" className="text-gray-400 hover:text-primary-400 transition-colors">Start Chatting</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xl font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">DMCA</a></li>
            </ul>
          </div>

          {/* Help & Safety */}
          <div>
            <h4 className="text-xl font-bold mb-4">Help & Safety</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Safety Tips</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Report User</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Block Users</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © 2026 MastiMeet. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <span>🔒 Secure & Private</span>
              <span>🌍 Available Worldwide</span>
              <span>🎯 18+ Only</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
