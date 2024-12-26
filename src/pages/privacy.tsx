import React, { useState } from 'react';
import { Shield, Mail, ChevronDown, ExternalLink } from 'lucide-react';

const PrivacySection = ({ title, children, isOpen, onToggle }) => (
  <div className="border border-gray-200 rounded-lg mb-4">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors rounded-lg"
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        {children}
      </div>
    )}
  </div>
);

const PrivacyPolicy = () => {
  const [openSections, setOpenSections] = useState(['information']);
  
  const toggleSection = (section) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Zaman Integrated Projects LLC (ZIP)</p>
              <p>Effective Date: December 26, 2024</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-blue-700 text-sm">
              At ZIP, your privacy is our priority. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website or services.
            </p>
          </div>

          <div className="mt-8">
            <PrivacySection 
              title="1. Information We Collect" 
              isOpen={openSections.includes('information')}
              onToggle={() => toggleSection('information')}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">1.1 Personal Information</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Name</li>
                    <li>Phone number</li>
                    <li>Email address</li>
                    <li>Passport details (when applying for visas)</li>
                    <li>Uploaded photos and documents</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">1.2 Usage Data</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Device information (browser type, IP address, operating system)</li>
                    <li>Cookies and similar technologies to enhance user experience</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">1.3 Payment Information</h3>
                  <p className="text-gray-600">
                    Payment details for processing transactions securely. We do not store card details directly; these are handled by trusted third-party payment processors.
                  </p>
                </div>
              </div>
            </PrivacySection>

            <PrivacySection 
              title="2. How We Use Your Information"
              isOpen={openSections.includes('usage')}
              onToggle={() => toggleSection('usage')}
            >
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Process visa applications and other related services</li>
                <li>Improve our website and user experience</li>
                <li>Communicate with you regarding inquiries, updates, or promotional offers (if opted in)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </PrivacySection>

            <PrivacySection 
              title="3. Sharing Your Information"
              isOpen={openSections.includes('sharing')}
              onToggle={() => toggleSection('sharing')}
            >
              <p className="text-gray-600 mb-4">We do not sell or rent your personal data. However, your information may be shared with:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li><span className="font-medium">Service providers:</span> To process visas, payments, and document verification</li>
                <li><span className="font-medium">Authorities:</span> For visa-related requirements or legal compliance</li>
                <li><span className="font-medium">Third parties:</span> In case of mergers, acquisitions, or legal disputes</li>
              </ul>
            </PrivacySection>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h2>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <a href="mailto:support@zipvisa.com" className="text-blue-600 hover:underline">
                  support@zipvisa.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Zaman Integrated Projects LLC. All rights reserved.</p>
          <p className="mt-2">
            <a href="https://zipvisa.com" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
              Visit ZipVisa.com
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
