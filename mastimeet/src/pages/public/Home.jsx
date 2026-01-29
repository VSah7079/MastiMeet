import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="flex justify-between items-center px-[5%] py-6 bg-white/10 backdrop-blur-md sticky top-0 z-50 border-b border-white/20">
        <div className="text-3xl font-bold text-white">
          <h2>🎭 MastiMeet</h2>
        </div>
        <div className="flex gap-8 items-center">
          <Link to="/about" className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all">About</Link>
          <Link to="/contact" className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all">Contact</Link>
          <Link to="/login" className="bg-transparent border-2 border-white px-4 py-2 rounded-lg text-white transition-all hover:bg-white/20">Login</Link>
          <Link to="/register" className="bg-white text-primary-500 font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-lg">Sign Up</Link>
        </div>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-[5%] py-24 items-center min-h-[calc(100vh-80px)] text-white">
        <div className="animate-fade-in-left">
          <h1 className="text-6xl font-extrabold leading-tight mb-6 text-white">
            Connect with Random People <br />
            <span className="text-yellow-300">Safely & Anonymously</span>
          </h1>
          <p className="text-xl text-white opacity-90 mb-10 leading-relaxed">
            Meet new friends, have fun conversations, and discover interesting people from around the world
          </p>
          <div className="flex gap-6">
            <Link to="/join" className="bg-white/20 text-primary-500  border-2 border-white px-10 py-4 text-lg font-semibold rounded-full transition-all hover:-translate-y-1 hover:shadow-2xl">
              🚀 Start Chatting Now
            </Link>
            <Link to="/about" className="bg-white/20 text-white border-2 border-white px-10 py-4 text-lg font-semibold rounded-full transition-all hover:bg-white hover:text-primary-500">
              Learn More
            </Link>
          </div>
        </div>
        <div className="relative h-[500px]">
          <div className="absolute top-[10%] left-[10%] bg-white text-primary-500 p-6 rounded-3xl shadow-2xl animate-float">
            <span className="text-5xl block mb-2">👋</span>
            <p className="font-semibold">Say Hi!</p>
          </div>
          <div className="absolute top-[20%] right-[10%] bg-white text-primary-500 p-6 rounded-3xl shadow-2xl animate-float" style={{animationDelay: '0.5s'}}>
            <span className="text-5xl block mb-2">🎮</span>
            <p className="font-semibold">Gaming</p>
          </div>
          <div className="absolute bottom-[30%] left-[20%] bg-white text-primary-500 p-6 rounded-3xl shadow-2xl animate-float" style={{animationDelay: '1s'}}>
            <span className="text-5xl block mb-2">🎵</span>
            <p className="font-semibold">Music</p>
          </div>
          <div className="absolute bottom-[10%] right-[20%] bg-white text-primary-500 p-6 rounded-3xl shadow-2xl animate-float" style={{animationDelay: '1.5s'}}>
            <span className="text-5xl block mb-2">⚽</span>
            <p className="font-semibold">Sports</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-800 px-[5%] py-24">
        <h2 className="text-5xl font-bold text-center mb-16 text-white">Why Choose MastiMeet?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-700 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Video & Text Chat</h3>
            <p className="text-gray-300">Connect through video or text - your choice!</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Safe & Secure</h3>
            <p className="text-gray-300">Your privacy is our priority with end-to-end encryption</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Interest Matching</h3>
            <p className="text-gray-300">Connect with people who share your interests</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Instant Connect</h3>
            <p className="text-gray-300">No waiting - start chatting in seconds</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Report & Block</h3>
            <p className="text-gray-300">Easy tools to report inappropriate behavior</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Global Community</h3>
            <p className="text-gray-300">Meet people from all around the world</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-800 px-[5%] py-24 text-center"><div className="text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">Ready to Make New Friends?</h2>
          <p className="text-xl mb-10 text-white/90">Join thousands of users already having fun on MastiMeet</p>
          <Link to="/register" className="inline-block bg-white/20 border-2 border-white text-primary-500 font-bold text-lg px-12 py-5 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Get Started Free
          </Link>
        </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white px-[5%] py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-3xl font-bold mb-4">🎭 MastiMeet</h3>
            <p className="text-gray-400">Connect, Chat, Have Fun!</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Legal</h4>
            <div className="flex flex-col gap-3">
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/guidelines" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Support</h4>
            <div className="flex flex-col gap-3">
              <Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">&copy; 2026 MastiMeet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
