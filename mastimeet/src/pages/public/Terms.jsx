import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-md px-[5%] py-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white">🎭 MastiMeet</Link>
        <Link to="/" className="bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors">Back to Home</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-[5%] py-16">
        <div className="bg-gray-800 rounded-3xl shadow-lg p-12">
          <h1 className="text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-gray-400 mb-12">Last Updated: January 28, 2026</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
              By accessing and using MastiMeet ("the Service"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">2. Use License</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Permission is granted to temporarily use MastiMeet for personal, non-commercial purposes. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to reverse engineer any software contained on MastiMeet</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">3. User Conduct</h2>
            <p className="text-gray-300 leading-relaxed mb-4">You agree to use MastiMeet responsibly and not to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Harass, abuse, or harm another person</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Spam, solicit, or collect information from other users</li>
              <li>Impersonate or misrepresent your affiliation with any person or entity</li>
              <li>Share inappropriate, offensive, or illegal content</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">4. Age Requirement</h2>
            <p className="text-gray-300 leading-relaxed">
              You must be at least 18 years old to use MastiMeet. By using the Service, you represent 
              and warrant that you are of legal age to form a binding contract.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">5. Account Security</h2>
            <p className="text-gray-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and 
              for all activities that occur under your account. You agree to notify us immediately of 
              any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">6. Content Ownership</h2>
            <p className="text-gray-300 leading-relaxed">
              You retain ownership of any content you submit to MastiMeet. However, by submitting content, 
              you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute 
              your content in connection with the Service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">7. Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Your use of MastiMeet is also governed by our Privacy Policy. Please review our{' '}
              <Link to="/privacy" className="text-primary-500 hover:underline font-semibold">Privacy Policy</Link>, which also governs the Service and informs 
              users of our data collection practices.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">8. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without 
              prior notice or liability, for any reason, including breach of these Terms. Upon termination, 
              your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">9. Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              The materials on MastiMeet are provided on an 'as is' basis. MastiMeet makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without 
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
              or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">10. Limitations</h2>
            <p className="text-gray-300 leading-relaxed">
              In no event shall MastiMeet or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising out 
              of the use or inability to use MastiMeet.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">11. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India 
              and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">12. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material 
              changes via email or through the Service. Your continued use of the Service after such 
              modifications constitutes your acknowledgment and acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">13. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at{' '}
              <a href="mailto:legal@mastimeet.com" className="text-primary-500 hover:underline font-semibold">legal@mastimeet.com</a>
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-300 text-lg mb-6">By using MastiMeet, you acknowledge that you have read and understood these Terms & Conditions.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-linear-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg px-10 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all">I Accept - Let's Start</Link>
              <Link to="/" className="bg-gray-200 text-gray-300 font-bold text-lg px-10 py-4 rounded-full hover:bg-gray-300 transition-all">Decline</Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
