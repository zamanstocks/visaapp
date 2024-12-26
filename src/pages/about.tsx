// src/pages/about.tsx
import React from 'react';
import { 
  Bot, 
  Building2, 
  Target, 
  Globe2, 
  Award, 
  Eye, 
  Fingerprint,
  Send,
  FileText,
  Camera,
  ChevronRight
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-100 transition-colors">
    <div className="flex items-start gap-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            Zaman Integrated Projects LLC
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simplifying Travel Documentation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Through cutting-edge automation and AI, we make visa applications and travel planning 
            stress-free and accessible.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Our Mission</span>
            </div>
            <p className="text-gray-600">
              To redefine visa processing with speed, accuracy, and transparency while delivering 
              exceptional customer experience.
            </p>
          </div>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
              <Eye className="w-5 h-5" />
              <span className="font-semibold">Our Vision</span>
            </div>
            <p className="text-gray-600">
              To be a global leader in travel solutions by integrating technology with personalized service.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Choose Us?</h2>
          <div className="grid gap-6">
            <FeatureCard 
              icon={Fingerprint}
              title="AI-Powered Solutions"
              description="Simplifying visa applications with OCR and automated form filling."
            />
            <FeatureCard 
              icon={Globe2}
              title="Global Reach"
              description="Expertise in handling visas for Oman, UAE, Qatar, Saudi Arabia, Bahrain, and more."
            />
            <FeatureCard 
              icon={Award}
              title="Trustworthy Service"
              description="Proven track record of reliability and client satisfaction."
            />
          </div>
        </div>
      </section>

      {/* Support Sender */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-green-700 text-sm font-medium mb-4">
              <Bot className="w-4 h-4" />
              Introducing Support Sender
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Share Documents via WhatsApp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Support Sender lets you share essential documents for visa processing directly via 
              WhatsApp. Whether it's a passport scan or a photo, our system handles it seamlessly.
            </p>
          </div>

          {/* How it Works */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 1</h3>
              <p className="text-gray-600 text-sm">
                Save our WhatsApp number to your contacts
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 2</h3>
              <p className="text-gray-600 text-sm">
                Send the required documents with a simple message
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 3</h3>
              <p className="text-gray-600 text-sm">
                Our bot Ava will guide you through the process
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">What You Need</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span>Passport copy</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span>Recent photograph</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              It's that simple. Your travel starts with one WhatsApp message.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
