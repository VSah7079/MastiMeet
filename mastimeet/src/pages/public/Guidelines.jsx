import { Link } from 'react-router-dom';

const Guidelines = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-md px-[5%] py-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white">🎭 MastiMeet</Link>
        <Link to="/" className="bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors">Back to Home</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-[5%] py-16">
        <div className="bg-gray-800 rounded-3xl shadow-lg p-12">
          <h1 className="text-5xl font-bold text-white mb-4">Community Guidelines</h1>
          <p className="text-xl text-gray-300 mb-8">Let's make MastiMeet a safe and welcoming place for everyone!</p>

        <div className="space-y-8">
          <div className="bg-gray-700 rounded-2xl p-8">
            <p className="text-gray-300 text-lg leading-relaxed">
            These guidelines help maintain a positive and respectful community. By using MastiMeet, 
            you agree to follow these rules. Violations may result in warnings, temporary suspension, 
            or permanent ban.
          </p>
          </div>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">✅ Do's - What We Encourage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-700 border-2 border-green-600 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <span className="text-5xl block mb-4">🤝</span>
                <h3 className="text-xl font-bold text-white mb-2">Be Respectful</h3>
                <p className="text-gray-300">Treat everyone with kindness and respect, regardless of their background</p>
              </div>
              <div className="bg-gray-700 border-2 border-green-600 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <span className="text-5xl block mb-4">💬</span>
                <h3 className="text-xl font-bold text-white mb-2">Stay Friendly</h3>
                <p className="text-gray-300">Keep conversations positive and welcoming</p>
              </div>
              <div className="bg-gray-700 border-2 border-green-600 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <span className="text-5xl block mb-4">🎯</span>
                <h3 className="text-xl font-bold text-white mb-2">Stay on Topic</h3>
                <p className="text-gray-300">Keep discussions relevant and meaningful</p>
              </div>
              <div className="guideline-card do-card">
                <span className="icon">🛡️</span>
                <h3>Report Issues</h3>
                <p>Help us by reporting inappropriate behavior</p>
              </div>
              <div className="guideline-card do-card">
                <span className="icon">👤</span>
                <h3>Be Yourself</h3>
                <p>Authenticity creates genuine connections</p>
              </div>
              <div className="guideline-card do-card">
                <span className="icon">🎨</span>
                <h3>Be Creative</h3>
                <p>Express yourself in positive and fun ways</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">❌ Don'ts - What's Not Allowed</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4 border-l-4 border-red-500">
                <span className="text-4xl">🚫</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">No Harassment or Bullying</h4>
                  <p className="text-gray-300">Any form of harassment, bullying, intimidation, or abusive behavior is strictly prohibited</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4 border-l-4 border-red-500">
                <span className="text-4xl">🔞</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">No Inappropriate Content</h4>
                  <p className="text-gray-300">No nudity, sexual content, or explicit material of any kind</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4 border-l-4 border-red-500">
                <span className="text-4xl">💢</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">No Hate Speech</h4>
                  <p className="text-gray-300">Racism, sexism, homophobia, and any form of discrimination will not be tolerated</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4 border-l-4 border-red-500">
                <span className="text-4xl">📧</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">No Spam or Advertising</h4>
                  <p className="text-gray-300">Don't spam links, promote products, or solicit personal information</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4 border-l-4 border-red-500">
                <span className="text-4xl">👎</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">No Impersonation</h4>
                  <p className="text-gray-300">Don't pretend to be someone else or create misleading profiles</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4 border-l-4 border-red-500">
                <span className="text-4xl">⚖️</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">No Illegal Activity</h4>
                  <p className="text-gray-300">Discussion or promotion of illegal activities is forbidden</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4 border-l-4 border-red-500">
                <span className="text-4xl">🤖</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">No Bots or Automation</h4>
                  <p className="text-gray-300">Use of bots, scripts, or automated tools is not allowed</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4 border-l-4 border-red-500">
                <span className="text-4xl">💳</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">No Financial Scams</h4>
                  <p className="text-gray-300">Don't ask for money, financial information, or promote scams</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">🛡️ Safety Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4">
                <span className="text-5xl font-bold text-primary-400 w-12 text-center">1</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Protect Your Privacy</h4>
                  <p className="text-gray-300">Don't share personal information like address, phone number, or financial details</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4">
                <span className="text-5xl font-bold text-primary-400 w-12 text-center">2</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Trust Your Instincts</h4>
                  <p className="text-gray-300">If something feels wrong, end the conversation and report it</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4">
                <span className="text-5xl font-bold text-primary-400 w-12 text-center">3</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Report Suspicious Behavior</h4>
                  <p className="text-gray-300">Help us keep the community safe by reporting violations</p>
                </div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6 flex gap-4">
                <span className="text-5xl font-bold text-primary-400 w-12 text-center">4</span>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Block Users When Needed</h4>
                  <p className="text-gray-300">Use the block feature if someone makes you uncomfortable</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">⚠️ Consequences of Violations</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 border-l-4 border-yellow-500 rounded-xl p-6">
                <strong className="text-lg text-white block mb-2">🟨 First Warning</strong>
                <p className="text-gray-300">Minor violations receive a formal warning</p>
              </div>
              <div className="bg-orange-50 border-l-4 border-orange-500 rounded-xl p-6">
                <strong className="text-lg text-white block mb-2">🟧 Temporary Ban</strong>
                <p className="text-gray-300">Repeated violations result in 7-30 day suspension</p>
              </div>
              <div className="bg-gray-700 border-l-4 border-red-500 rounded-xl p-6">
                <strong className="text-lg text-white block mb-2">🔴 Permanent Ban</strong>
                <p className="text-gray-300">Serious or repeated violations lead to permanent account termination</p>
              </div>
            </div>
            <p className="bg-gray-700 rounded-xl p-4 text-gray-300">
              We reserve the right to take immediate action for serious violations without prior warning
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">📢 How to Report</h2>
            <div className="space-y-4">
              <div className="flex gap-6 items-start">
                <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0">1</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">During Chat</h4>
                  <p className="text-gray-300">Click the "Report" button in the chat interface</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0">2</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Select Reason</h4>
                  <p className="text-gray-300">Choose the type of violation from the list</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0">3</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Provide Details</h4>
                  <p className="text-gray-300">Add any additional information that may help</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0">4</div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Submit</h4>
                  <p className="text-gray-300">Our team will review within 24 hours</p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-linear-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-3xl font-bold text-white">Together, We Make MastiMeet Better!</h3>
            <p className="text-lg text-gray-300">By following these guidelines, you help create a positive experience for everyone</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-linear-to-r from-primary-500 to-secondary-500 text-white font-bold px-8 py-3 rounded-full hover:shadow-lg transition-all">I Understand - Join Now</Link>
              <a href="#" className="bg-white text-primary-400 font-bold px-8 py-3 rounded-full border-2 border-primary-500 hover:shadow-lg transition-all">Report a Violation</a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
