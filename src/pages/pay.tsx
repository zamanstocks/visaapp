import React, { useState } from 'react';
import { 
  Building2, Shield, CheckCircle, MessageSquare,
  Copy, ArrowRight, Wallet, CreditCard,
  HelpCircle, ExternalLink
} from 'lucide-react';

const PaymentPage = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bank'); // 'bank' or 'card'
  const amount = 299;

  const bankAccounts = [
    {
      id: 'bankmuscat',
      name: 'Bank Muscat',
      icon: <Building2 className="h-6 w-6 text-[#6B2D5C]" />,
      accountNumber: '0123 4567 8910',
      accountName: 'COMPANY NAME LLC',
      description: 'Most popular - Regular bank transfer'
    },
    {
      id: 'wallet',
      name: 'Bank Muscat Wallet',
      icon: <Wallet className="h-6 w-6 text-[#6B2D5C]" />,
      accountNumber: '9999 8888 7777',
      description: 'Instant transfer via mobile wallet'
    },
    {
      id: 'sohar',
      name: 'Sohar International',
      icon: <Building2 className="h-6 w-6 text-[#0072BC]" />,
      accountNumber: '9876 5432 1098',
      accountName: 'COMPANY NAME LLC',
      description: 'Transfer from your Sohar account'
    }
  ];

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/YOUR_WHATSAPP_NUMBER', '_blank');
  };

  const handleCardPayment = () => {
    // Redirect to payment gateway
    console.log('Redirecting to payment gateway...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Secure Payment</h1>
          <div className="mt-4 bg-blue-50 text-blue-700 py-3 px-6 rounded-full inline-block">
            <span className="text-2xl font-bold">OMR {amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Payment Method Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            {['bank', 'card'].map((method) => (
              <button
                key={method}
                onClick={() => {
                  setPaymentMethod(method);
                  setSelectedBank(null);
                }}
                className={`py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all
                  ${paymentMethod === method 
                    ? 'bg-white shadow-sm text-blue-700' 
                    : 'text-slate-600 hover:bg-white/50'}`}
              >
                {method === 'bank' ? (
                  <>
                    <Building2 className="h-4 w-4" />
                    <span>Bank Transfer</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Card Payment</span>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            {paymentMethod === 'bank' ? (
              !selectedBank ? (
                <div className="space-y-3">
                  {/* Quick Help Card */}
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-green-800">Need help choosing?</h3>
                        <p className="text-sm text-green-700">All options are free of charge. Select any bank you have access to.</p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Options */}
                  {bankAccounts.map((bank) => (
                    <button 
                      key={bank.id}
                      onClick={() => setSelectedBank(bank)}
                      className="w-full p-4 border-2 rounded-lg cursor-pointer hover:border-blue-200 transition-all bg-white hover:bg-blue-50 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          {bank.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900">{bank.name}</h3>
                          <p className="text-sm text-slate-600">{bank.description}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <button 
                    onClick={() => setSelectedBank(null)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                  >
                    ← Choose different bank
                  </button>

                  <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                    <div className="flex items-center gap-3">
                      {selectedBank.icon}
                      <h3 className="font-medium text-lg">{selectedBank.name}</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Account Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{selectedBank.accountNumber}</span>
                          <button 
                            onClick={() => handleCopyClick(selectedBank.accountNumber)}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-blue-100 flex items-center justify-center"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {selectedBank.accountName && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Account Name</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{selectedBank.accountName}</span>
                            <button 
                              onClick={() => handleCopyClick(selectedBank.accountName)}
                              className="h-8 w-8 p-0 rounded-lg hover:bg-blue-100 flex items-center justify-center"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Amount</span>
                        <span className="font-medium">OMR {amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Simple Steps:</h4>
                    <ol className="text-sm text-amber-800 space-y-2">
                      <li>1. Transfer the exact amount shown above</li>
                      <li>2. Take a screenshot of your transfer or note the reference number</li>
                      <li>3. Submit it below or send it via WhatsApp</li>
                    </ol>
                  </div>

                  <div>
                    <input 
                      type="text"
                      placeholder="Enter transfer reference number"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-lg flex items-center justify-center gap-2 transition-colors">
                      Confirm Transfer
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-slate-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-slate-800">Forgot to take screenshot?</h3>
                        <p className="text-sm text-slate-600 mb-3">No worries! Just click the support button below and we'll help you out.</p>
                        <button 
                          onClick={handleWhatsAppSupport}
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <MessageSquare className="h-5 w-5" />
                          Get Help on WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="h-5 w-5 text-slate-600" />
                    <h3 className="font-medium">Secure Card Payment</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Pay securely with your Omani debit or credit card. You'll be redirected to your bank's secure payment page.
                  </p>
                  <button 
                    onClick={handleCardPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    Proceed to Card Payment
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <Shield className="h-4 w-4" />
                  <span>Bank-grade secure payment</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {!selectedBank && (
          <div className="mt-6 text-center">
            <button 
              onClick={handleWhatsAppSupport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-green-500" />
              <span className="text-slate-700">Need help? We're here!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;