import React, { ReactNode } from 'react';
import { Bot, Mail, Phone, MessageSquare, ArrowRight, LucideIcon } from 'lucide-react';

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon: Icon, title, children, className = '' }) => (
  <div className={`bg-white rounded-xl p-6 border border-gray-100 ${className}`}>
    <div className="flex items-start gap-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        {children}
      </div>
    </div>
  </div>
);

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Bot className="w-4 h-4" />
            Meet Ava
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your 24/7 Virtual Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're applying for a visa, tracking your application, or seeking support, 
            Ava will guide you every step of the way.
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Ava WhatsApp Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-8 border border-green-100">
            <div className="flex items-start gap-6">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <Bot className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect with Ava on WhatsApp</h2>
                <p className="text-gray-600 mb-6">
                  Get instant assistance with your visa applications and queries through our WhatsApp bot.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Save <strong>+968 77353039</strong> (AVA)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Start with "Hi Ava" or "I want to apply for a visa"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Contact Methods */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h2>
          <div className="grid gap-6">
            <ContactCard icon={Phone} title="Phone">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 mb-1"><strong>Oman Office:</strong></p>
                  <p className="text-gray-600">+968 78204228</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1"><strong>India Office:</strong></p>
                  <p className="text-gray-600">+91 96562 68099</p>
                </div>
              </div>
            </ContactCard>

            <ContactCard icon={Mail} title="Email">
              <a href="mailto:support@zipvisa.com" className="text-blue-600 hover:underline">
                support@zipvisa.com
              </a>
            </ContactCard>
          </div>

          {/* Support Message */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              We're here to help you make your travel journey smooth and stress-free.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;