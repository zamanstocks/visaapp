// src/pages/cookies.tsx
import React, { useState } from 'react';
import { Shield, Mail, ChevronDown } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Zaman Integrated Projects LLC</p>
              <p>Effective Date: December 26, 2024</p>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div className="prose max-w-none">
              <p className="text-gray-600">
                This Cookie Policy explains how ZIP ("we," "our," or "us") uses cookies and similar 
                technologies on ZipVisa.com.
              </p>

              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900">1. What Are Cookies?</h2>
                  <p className="text-gray-600">
                    Cookies are small text files stored on your device to improve your browsing 
                    experience and provide personalized services.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">2. Types of Cookies We Use</h2>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
                    <li><strong>Performance Cookies:</strong> Collect anonymous data for website performance and improvement.</li>
                    <li><strong>Functional Cookies:</strong> Store preferences for a tailored experience.</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our site.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">3. Managing Cookies</h2>
                  <p className="text-gray-600">
                    You can control cookies through your browser settings. Disabling cookies may affect 
                    your experience on our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">4. Third-Party Cookies</h2>
                  <p className="text-gray-600">
                    We may use trusted third-party services like Google Analytics to collect usage data. 
                    These parties follow their own privacy policies.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">5. Contact Us</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <a href="mailto:support@zipvisa.com" className="text-blue-600 hover:underline">
                      support@zipvisa.com
                    </a>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
