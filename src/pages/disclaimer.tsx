import React from 'react';
import { Shield, Mail } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Disclaimer</h1>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Zaman Integrated Projects LLC</p>
              <p>Effective Date: December 26, 2024</p>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div className="prose max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900">1. General Information</h2>
                  <p className="text-gray-600">
                    The content on ZipVisa.com is provided for informational purposes only. While we 
                    strive for accuracy, we make no guarantees about the completeness or reliability 
                    of the information provided.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">2. No Guarantees for Visa Approval</h2>
                  <p className="text-gray-600">
                    ZIP acts as a facilitator for visa applications and does not influence the decisions 
                    of respective authorities. Approval or rejection of visa applications is solely at 
                    the discretion of the issuing authority.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">3. Limitation of Liability</h2>
                  <p className="text-gray-600 mb-2">ZIP is not responsible for:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Errors, delays, or rejections by third-party authorities.</li>
                    <li>Losses due to technical issues, data inaccuracies, or user-provided errors.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">4. External Links</h2>
                  <p className="text-gray-600">
                    Our website may contain links to third-party websites. We are not responsible for 
                    the content, policies, or practices of these websites.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">5. Updates to Disclaimer</h2>
                  <p className="text-gray-600">
                    This Disclaimer may be updated periodically. Continued use of our services 
                    constitutes acceptance of the updated terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900">6. Contact Us</h2>
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

export default Disclaimer;
