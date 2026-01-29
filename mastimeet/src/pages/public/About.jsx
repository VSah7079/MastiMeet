import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-md px-[5%] py-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white">🎭 MastiMeet</Link>
        <Link to="/" className="bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors">Back to Home</Link>
      </nav>

      <section className="bg-gray-800 text-white text-center py-24 px-[5%]">
        <h1 className="text-6xl font-bold mb-4">About <span className="text-yellow-300">MastiMeet</span></h1>
        <p className="text-2xl text-white/90">Connecting people, creating friendships, building communities</p>
      </section>

      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">
              MastiMeet was born from a simple idea: everyone deserves meaningful connections. 
              In today's digital age, we believe that distance shouldn't be a barrier to making 
              new friends and having genuine conversations.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Founded in 2026, we've grown into a vibrant community of over 50,000 active users 
              from 150+ countries, facilitating millions of conversations every day.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-80 h-80 bg-gray-700 rounded-3xl flex items-center justify-center shadow-xl">
              <span className="text-9xl">🌍</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-3xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              To create a safe, inclusive platform where people from all walks of life can 
              connect, share experiences, and build meaningful relationships through authentic 
              conversations.
            </p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-4">👁️</div>
            <h3 className="text-3xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              A world where geographical boundaries don't limit friendships, and everyone can 
              find their community regardless of where they are.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-700 rounded-xl p-6 text-center">
              <span className="text-6xl block mb-3">🔒</span>
              <h4 className="text-xl font-bold text-white mb-2">Safety First</h4>
              <p className="text-gray-300">Your security and privacy are non-negotiable</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 text-center">
              <span className="text-6xl block mb-3">🤝</span>
              <h4 className="text-xl font-bold text-white mb-2">Respect</h4>
              <p className="text-gray-300">Treating every user with dignity and kindness</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 text-center">
              <span className="text-6xl block mb-3">🌈</span>
              <h4 className="text-xl font-bold text-white mb-2">Inclusivity</h4>
              <p className="text-gray-300">Welcoming people from all backgrounds</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 text-center">
              <span className="text-6xl block mb-3">✨</span>
              <h4 className="text-xl font-bold text-white mb-2">Innovation</h4>
              <p className="text-gray-300">Constantly improving your experience</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 text-center">
              <span className="text-6xl block mb-3">💚</span>
              <h4 className="text-xl font-bold text-white mb-2">Community</h4>
              <p className="text-gray-300">Building connections that matter</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 text-center">
              <span className="text-6xl block mb-3">🎯</span>
              <h4 className="text-xl font-bold text-white mb-2">Authenticity</h4>
              <p className="text-gray-300">Encouraging genuine interactions</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-white mb-4">Meet Our Team</h2>
          <p className="text-center text-gray-300 text-lg mb-12">
            We're a passionate group of developers, designers, and community managers 
            dedicated to making MastiMeet the best place to connect.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-7xl mb-4">👨‍💼</div>
              <h4 className="text-xl font-bold text-white mb-1">Vivek Kumar Sah</h4>
              <p className="text-primary-400 font-semibold mb-2">Founder & CEO</p>
              <p className="text-gray-300">Visionary behind MastiMeet</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-7xl mb-4">👩‍💻</div>
              <h4 className="text-xl font-bold text-white mb-1">Priya Patel</h4>
              <p className="text-primary-400 font-semibold mb-2">CTO</p>
              <p className="text-gray-300">Tech wizard keeping us running</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-7xl mb-4">👨‍🎨</div>
              <h4 className="text-xl font-bold text-white mb-1">Arjun Singh</h4>
              <p className="text-primary-400 font-semibold mb-2">Head of Design</p>
              <p className="text-gray-300">Making beauty happen</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-7xl mb-4">👩‍💼</div>
              <h4 className="text-xl font-bold text-white mb-1">Sneha Kumar</h4>
              <p className="text-primary-400 font-semibold mb-2">Community Manager</p>
              <p className="text-gray-300">Your voice matters to her</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center text-white mb-12">MastiMeet by Numbers</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">50K+</div>
              <div className="text-gray-300 text-lg">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">1M+</div>
              <div className="text-gray-300 text-lg">Daily Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">150+</div>
              <div className="text-gray-300 text-lg">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">4.8★</div>
              <div className="text-gray-300 text-lg">User Rating</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-3xl text-white text-center p-16 max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-xl text-gray-300 mb-8">Become part of our growing global community today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary-500 text-white font-bold text-lg px-10 py-4 rounded-full hover:shadow-2xl hover:scale-105 hover:bg-primary-600 transition-all">Get Started Free</Link>
            <Link to="/contact" className="bg-gray-700 text-white border-2 border-gray-600 font-bold text-lg px-10 py-4 rounded-full hover:bg-gray-600 transition-all">Contact Us</Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 text-center">
        <p className="mb-4">&copy; 2026 MastiMeet. All rights reserved.</p>
        <div className="flex justify-center gap-6">
          <Link to="/terms" className="hover:text-primary-300 transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-primary-300 transition-colors">Privacy</Link>
          <Link to="/contact" className="hover:text-primary-300 transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  );
};

export default About;
