import React from 'react';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';

const TermsOfService = () => {
  const router = useRouter();

  const termsSectons = [
    {
      title: "User Agreement",
      content: "By using ZipVisas, you agree to comply with our terms of service. This platform is designed to assist in visa application processes, and users must provide accurate and complete information."
    },
    {
      title: "Service Limitations",
      content: "While we strive to provide comprehensive visa application support, ZipVisas does not guarantee visa approval. Final decisions rest with respective immigration authorities."
    },
    {
      title: "User Responsibilities",
      content: "Users are responsible for verifying document accuracy, meeting application requirements, and maintaining the confidentiality of their account information."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-2 md:p-2.5">
                <span className="text-white font-serif text-lg md:text-xl">🌐</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-serif font-bold text-slate-900">
                  Zipvisas
                </span>
                <span className="text-xs text-slate-500">Est. 2013</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 md:space-x-8">
              <span className="hidden sm:inline-block text-xs md:text-sm font-serif text-slate-600">
                Trusted Global Service
              </span>
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-900 text-white px-3 md:px-6 py-2 md:py-2.5 rounded-lg hover:bg-blue-800 transition-all font-serif text-xs md:text-base"
              >
                Track Visa
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 md:mb-10 text-center">
          Terms of Service
        </h1>

        <div className="space-y-8 md:space-y-12">
          {termsSectons.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-blue-900 mb-4">
                {section.title}
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          <div className="bg-slate-50 p-6 md:p-8 rounded-xl text-center">
            <p className="text-sm text-slate-600">
              Last Updated: December 2024 | © {new Date().getFullYear()} ZipVisas. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
