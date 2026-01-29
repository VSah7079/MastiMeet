import { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-md px-[5%] py-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white">🎭 MastiMeet</Link>
        <Link to="/" className="bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors">Back to Home</Link>
      </nav>

      <div className="px-[5%] py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-300">We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
            <p className="text-gray-300 text-lg mb-8">
              Feel free to reach out through any of these channels
            </p>

            <div className="space-y-6 mb-12">
              <div className="bg-gray-800 rounded-xl p-6 shadow-md flex items-start gap-4">
                <div className="text-5xl">📧</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Email</h4>
                  <p className="text-primary-400 font-semibold mb-1">support@mastimeet.com</p>
                  <span className="text-sm text-gray-400">24-48 hours response</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 shadow-md flex items-start gap-4">
                <div className="text-5xl">💬</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Live Chat</h4>
                  <p className="text-primary-400 font-semibold mb-1">Available on website</p>
                  <span className="text-sm text-gray-400">Mon-Fri, 9AM-6PM IST</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 shadow-md flex items-start gap-4">
                <div className="text-5xl">📱</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Social Media</h4>
                  <p className="text-primary-400 font-semibold mb-1">@MastiMeet</p>
                  <span className="text-sm text-gray-400">Twitter, Instagram, Facebook</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 shadow-md flex items-start gap-4">
                <div className="text-5xl">🏢</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Office</h4>
                  <p className="text-primary-400 font-semibold mb-1">Mumbai, India</p>
                  <span className="text-sm text-gray-400">By appointment only</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/help" className="flex items-center gap-3 text-gray-300 hover:text-primary-400 transition-colors">
                  <span className="text-2xl">📚</span>
                  <span className="font-semibold">Help Center</span>
                </Link>
                <Link to="/guidelines" className="flex items-center gap-3 text-gray-300 hover:text-primary-400 transition-colors">
                  <span className="text-2xl">📋</span>
                  <span className="font-semibold">Community Guidelines</span>
                </Link>
                <Link to="/safety" className="flex items-center gap-3 text-gray-300 hover:text-primary-400 transition-colors">
                  <span className="text-2xl">🛡️</span>
                  <span className="font-semibold">Safety Tips</span>
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-7xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-300">We'll get back to you within 24-48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">Subject *</label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="report">Report Issue</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">Message *</label>
                    <textarea
                      id="message"
                      rows="6"
                      placeholder="Tell us what's on your mind..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-white"
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full bg-primary-500 text-white font-bold text-lg py-4 rounded-xl hover:shadow-xl hover:scale-105 hover:bg-primary-600 transition-all">
                    Send Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-3xl font-bold text-white mb-6">⏰ Support Hours</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-lg font-semibold text-white">Monday - Friday</span>
                <span className="text-lg text-primary-400 font-bold">9:00 AM - 6:00 PM IST</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-lg font-semibold text-white">Saturday</span>
                <span className="text-lg text-primary-400 font-bold">10:00 AM - 4:00 PM IST</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-lg font-semibold text-white">Sunday</span>
                <span className="text-lg text-red-400 font-bold">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 text-center mt-16">
        <p>&copy; 2026 MastiMeet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
