import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 shadow-md fixed w-full top-0 left-0 z-50 px-[5%] py-6">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white">
          🎭 MastiMeet
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">About</Link>
          <Link to="/guidelines" className="text-gray-400 hover:text-primary-400 transition-colors">Guidelines</Link>
          <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-gray-400 hover:text-primary-400 transition-colors font-semibold"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-primary-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
