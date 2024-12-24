import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
                </svg>
              </div>
              <span className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Zipvisas
              </span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Revolutionizing the visa application process with cutting-edge AI and world-class support.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-300">Government Licensed</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-3.866-3.582-7-8-7m16 0c-4.418 0-8 3.134-8 7m8 0H4m8 0v6m-4 4h8" />
                </svg>
                <span className="text-sm text-gray-300">Secure & Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-yellow-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                </svg>
                <span className="text-sm text-gray-300">Trusted Since 2013</span>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-100 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>▸</span>
                <span>About Us</span>
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>▸</span>
                <span>Track Application</span>
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>▸</span>
                <span>Support Center</span>
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>▸</span>
                <span>Contact</span>
              </a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-100 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>▸</span>
                <span>Privacy Policy</span>
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>▸</span>
                <span>Terms of Service</span>
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>▸</span>
                <span>Cookie Policy</span>
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>▸</span>
                <span>Disclaimer</span>
              </a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-100 mb-4">Contact & Support</h3>
            <ul className="space-y-3">
              <li>
                <p className="text-sm text-gray-400 leading-relaxed">
                  <strong>Headquarters (Oman):</strong><br />
                  Zaman Integrated Projects L.L.C<br />
                  محافظة الداخلية, Oman<br />
                  Phone: +968 78294228 / 77353039<br />
                  Email: support@zipoman.co
                </p>
              </li>
              <li>
                <p className="text-sm text-gray-400 leading-relaxed">
                  <strong>Branch Office (India):</strong><br />
                  Hajyar Building, Kalpetta<br />
                  Kerala, India
                </p>
              </li>
              <li>
                <p className="text-sm text-gray-400 leading-relaxed">
                  <strong>Apply via WhatsApp:</strong><br />
                  77353039 (AVA - AI Visa Expert)
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;