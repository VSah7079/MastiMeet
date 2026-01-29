import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-md px-[5%] py-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white">🎭 MastiMeet</Link>
        <Link to="/" className="bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors">Back to Home</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-[5%] py-16">
        <div className="bg-gray-800 rounded-3xl shadow-lg p-12">
          <h1 className="text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 mb-12">Last Updated: January 28, 2026</p>

        <div className="space-y-8">
          <div className="bg-gray-700 rounded-2xl p-8">
            <p className="text-gray-300 text-lg leading-relaxed">
            At MastiMeet, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our service.
          </p>
          </div>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">🔍 Information We Collect</h2>
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-bold text-white mb-4">Personal Information</h3>
                <p className="text-gray-300 mb-4">When you register, we collect:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Email address</li>
                  <li>Username</li>
                  <li>Age (to verify you're 18+)</li>
                  <li>Gender (optional)</li>
                  <li>Profile picture (optional)</li>
                </ul>
              </div>
              
              <div className="bg-gray-700 rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-bold text-white mb-4">Usage Information</h3>
                <p className="text-gray-300 mb-4">We automatically collect:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Chat duration and frequency</li>
                  <li>Features used</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">🎯 How We Use Your Information</h2>
            <p className="text-gray-300">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide and maintain our Service</li>
              <li>Match you with other users based on interests</li>
              <li>Improve user experience</li>
              <li>Send important updates and notifications</li>
              <li>Prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns to improve features</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">🔒 How We Protect Your Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <span className="text-5xl block mb-3">🔐</span>
                <h4 className="text-xl font-bold text-white mb-2">Encryption</h4>
                <p className="text-gray-300">End-to-end encryption for all chats</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <span className="text-5xl block mb-3">🛡️</span>
                <h4 className="text-xl font-bold text-white mb-2">Secure Servers</h4>
                <p className="text-gray-300">Industry-standard security protocols</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <span className="text-5xl block mb-3">🔑</span>
                <h4 className="text-xl font-bold text-white mb-2">Access Control</h4>
                <p className="text-gray-300">Limited employee access to data</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <span className="text-5xl block mb-3">📱</span>
                <h4 className="text-xl font-bold text-white mb-2">Two-Factor Auth</h4>
                <p className="text-gray-300">Optional 2FA for extra security</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">🤝 Sharing Your Information</h2>
            <p className="text-gray-300">We do NOT sell your personal information. We may share data only in these cases:</p>
            <div className="space-y-4">
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border-l-4 border-primary-500">
                <strong className="text-white block mb-2">With Your Consent:</strong>
                <p className="text-gray-300">When you explicitly agree to share information</p>
              </div>
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border-l-4 border-primary-500">
                <strong className="text-white block mb-2">Service Providers:</strong>
                <p className="text-gray-300">Third-party services that help us operate (hosting, analytics)</p>
              </div>
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border-l-4 border-primary-500">
                <strong className="text-white block mb-2">Legal Requirements:</strong>
                <p className="text-gray-300">When required by law or to protect rights and safety</p>
              </div>
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border-l-4 border-primary-500">
                <strong className="text-white block mb-2">Business Transfers:</strong>
                <p className="text-gray-300">In case of merger, acquisition, or asset sale</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">🍪 Cookies and Tracking</h2>
            <p className="text-gray-300">We use cookies and similar technologies to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Remember your preferences</li>
              <li>Analyze site traffic</li>
              <li>Personalize content</li>
              <li>Improve functionality</li>
            </ul>
            <p className="bg-blue-50 p-4 rounded-lg text-gray-300">
              You can control cookies through your browser settings, but some features may not work properly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">👤 Your Rights</h2>
            <p className="text-gray-300">You have the right to:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md text-center">
                <span className="text-4xl block mb-3">📋</span>
                <strong className="text-white block mb-2">Access</strong>
                <p className="text-gray-300">Request a copy of your data</p>
              </div>
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md text-center">
                <span className="text-4xl block mb-3">✏️</span>
                <strong className="text-white block mb-2">Correction</strong>
                <p className="text-gray-300">Update incorrect information</p>
              </div>
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md text-center">
                <span className="text-4xl block mb-3">🗑️</span>
                <strong className="text-white block mb-2">Deletion</strong>
                <p className="text-gray-300">Request account deletion</p>
              </div>
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md text-center">
                <span className="text-4xl block mb-3">⛔</span>
                <strong className="text-white block mb-2">Opt-Out</strong>
                <p className="text-gray-300">Unsubscribe from marketing</p>
              </div>
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md text-center">
                <span className="text-4xl block mb-3">📤</span>
                <strong className="text-white block mb-2">Portability</strong>
                <p className="text-gray-300">Export your data</p>
              </div>
              <div className="bg-linear-to-br from-white to-gray-50 rounded-xl p-6 shadow-md text-center">
                <span className="text-4xl block mb-3">🚫</span>
                <strong className="text-white block mb-2">Object</strong>
                <p className="text-gray-300">Object to data processing</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">👶 Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              MastiMeet is not intended for users under 18 years of age. We do not knowingly collect 
              information from children. If we discover that a child under 18 has provided us with 
              personal information, we will delete it immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">🌍 International Users</h2>
            <p className="text-gray-300 leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of your 
              country. By using MastiMeet, you consent to the transfer of information to countries that 
              may have different data protection rules.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">📝 Changes to Privacy Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant 
              changes via email or through a prominent notice on our Service. We encourage you to review 
              this Privacy Policy periodically.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">📞 Contact Us</h2>
            <p className="text-gray-300">If you have questions about this Privacy Policy, please contact us:</p>
            <div className="bg-blue-50 rounded-xl p-6 space-y-2">
              <p className="text-white"><strong>Email:</strong> <span className="text-primary-500">privacy@mastimeet.com</span></p>
              <p className="text-white"><strong>Address:</strong> MastiMeet Privacy Team, Mumbai, India</p>
              <p className="text-white"><strong>Response Time:</strong> Within 48 hours</p>
            </div>
          </section>

          <div className="bg-linear-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center space-y-4">
            <p className="text-lg text-white">Your privacy matters to us. We're committed to protecting your personal information.</p>
            <Link to="/contact" className="inline-block bg-linear-to-r from-primary-500 to-secondary-500 text-white font-bold px-8 py-3 rounded-full hover:shadow-lg transition-all">Have Privacy Questions?</Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
