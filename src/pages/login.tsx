import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Globe, Check, Phone, Mail, ChevronDown,
  RefreshCw, Shield, Smartphone, HelpCircle, Lock, FileText
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    // User input in login page
    firstName: '',
    phoneNumber: '',
    email: '',
    
    // Data from select.tsx
    destinationId: searchParams.get('destinationId') || '',
    destinationName: searchParams.get('destinationName') || '',
    destinationCode: searchParams.get('destinationCode') || '',
    nationalityId: searchParams.get('nationalityId') || '',
    nationalityName: searchParams.get('nationalityName') || '',
    visaId: searchParams.get('visaId') || '',
    visaName: searchParams.get('visaName') || '',
    visaType: searchParams.get('visaType') || '',
    visaPrice: searchParams.get('visaPrice') || '',
    visaDuration: searchParams.get('visaDuration') || '',
    processingTime: searchParams.get('processingTime') || ''
  });

  const [selectedCountry, setSelectedCountry] = useState({
    code: '+968',
    flag: '🇴🇲',
    name: 'Oman',
    maxLength: 8
  });

  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [showEmailOption, setShowEmailOption] = useState(false);
  const [currentStep, setCurrentStep] = useState<'details' | 'otp'>('details');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const countries = [
    { code: '+968', flag: '🇴🇲', name: 'Oman', maxLength: 8 },
    { code: '+91', flag: '🇮🇳', name: 'India', maxLength: 10 },
    { code: '+971', flag: '🇦🇪', name: 'UAE', maxLength: 9 },
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia', maxLength: 9 },
    { code: '+974', flag: '🇶🇦', name: 'Qatar', maxLength: 8 },
    { code: '+973', flag: '🇧🇭', name: 'Bahrain', maxLength: 8 }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, countdown]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      value = value.replace(/\D/g, '').slice(0, selectedCountry.maxLength);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingOtp(true);
    setErrorMessage('');

    try {
      if (formData.phoneNumber.length !== selectedCountry.maxLength) {
        throw new Error(`Please enter a valid ${selectedCountry.maxLength}-digit number`);
      }

      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          countryCode: selectedCountry.code,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setCurrentStep('otp');
        setCountdown(60);
        setCanResend(false);
        setOtpDigits(['', '', '', '', '', '']);
      } else {
        setErrorMessage(result.error || 'Failed to send OTP. Try again.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value.slice(0, 1);
    setOtpDigits(newOtpDigits);
  
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  
    if (newOtpDigits.every(digit => digit !== '')) {
      const enteredOtp = newOtpDigits.join('');
      
      const verifyOtp = async () => {
        try {
          const response = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: formData.phoneNumber,
              countryCode: selectedCountry.code,
              otp: enteredOtp,
              createdAt: new Date().toISOString()
            }),
          });
  
          const result = await response.json();
          
          if (response.ok) {
            const queryParams = new URLSearchParams({
              phone: `${selectedCountry.code}${formData.phoneNumber}`,
              firstName: formData.firstName,
              email: formData.email || '',
              destination: searchParams.get('destination') || '',
              nationality: searchParams.get('nationality') || '',
              visaType: searchParams.get('visaType') || ''
            }).toString();
            
            router.push(`/form?${queryParams}`);
          } else {
            setErrorMessage('Invalid verification code');
            setOtpDigits(['', '', '', '', '', '']);
            otpInputRefs.current[0]?.focus();
          }
        } catch (error) {
          console.error('Verification error:', error);
          setErrorMessage('Verification failed. Please try again.');
          setOtpDigits(['', '', '', '', '', '']);
          otpInputRefs.current[0]?.focus();
        }
      };
  
      verifyOtp();
    }
  };

  const handleResendOtp = () => {
    setCountdown(60);
    setCanResend(false);
    handleSendOTP(new Event('submit') as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4 flex items-center justify-center">
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStep === 'details' ? 'Create Your Account' : 'Verify Your Number'}
          </h1>
          <p className="text-gray-600 max-w-xs mx-auto">
            {currentStep === 'details' 
              ? 'Enter your details to get started' 
              : `Enter the 6-digit code sent to ${selectedCountry.code} ${formData.phoneNumber}`
            }
          </p>
          <div className="text-center mt-6">
            <span 
              onClick={() => {
                const queryParams = new URLSearchParams({
                  firstName: "Zaman",
                  phone: "78204228",
                  destination: "United Arab Emirates",
                  nationality: "Philippines",
                  visaType: "Tourist Visa",
                }).toString();
                router.push(`/form?${queryParams}`);
              }}
              className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm md:text-base font-semibold underline decoration-dotted transition duration-300 ease-in-out transform hover:scale-105"
            >
              Travel Agent Login
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-600 text-center mb-4 bg-red-50 p-3 rounded-lg flex items-center justify-center gap-2 animate-shake">
            <Shield className="w-5 h-5 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden transform hover:scale-[1.01] transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>

          {currentStep === 'details' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="transform transition-all hover:scale-[1.01]">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="transform transition-all hover:scale-[1.01]">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  Phone Number
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountrySelect(!showCountrySelect)}
                    className="h-full absolute inset-y-0 left-0 px-4 flex items-center gap-2 hover:bg-gray-50 rounded-l-lg border-r transition-colors"
                  >
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full pl-32 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder={`Enter ${selectedCountry.maxLength} digits`}
                    maxLength={selectedCountry.maxLength}
                    required
                  />

                  {showCountrySelect && (
                    <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountrySelect(false);
                            setFormData(prev => ({ ...prev, phoneNumber: '' }));
                          }}
                          className="w-full px-4 py-2 flex items-center gap-3 hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-xl">{country.flag}</span>
                          <span className="font-medium">{country.name}</span>
                          <span className="text-gray-600">{country.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="transform transition-all hover:scale-[1.01]">
                <button
                  type="button"
                  onClick={() => setShowEmailOption(!showEmailOption)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Add email address (optional)</span>
                </button>

                {showEmailOption && (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter your email"
                  />
                )}
              </div>

              <button 
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 
                          flex items-center justify-center gap-2 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
              >
                {isSendingOtp ? 'Sending...' : 'Send Verification Code'}
                <Phone className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center gap-2 mb-6">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-10 h-12 text-center text-xl border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                    inputMode="numeric"
                    pattern="[0-9]"
                  />
                ))}
              </div>

              <div className="flex justify-center items-center gap-4 mb-6">
                {!canResend ? (
                  <p className="text-gray-600 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    Resend code in {countdown} seconds
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 
                             transition-colors transform hover:scale-105"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend Code
                  </button>
                )}
              </div>

              <button 
                onClick={() => setCurrentStep('details')}
                className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg 
                          hover:bg-blue-50 transition-colors flex items-center justify-center 
                          gap-2 transform hover:scale-[1.02]"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Phone Number
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            {currentStep === 'details'
              ? 'We will send you a verification code to confirm your number'
              : 'Verification code sent via WhatsApp'}
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center 
                            gap-2 transition-colors transform hover:scale-105">
            <HelpCircle className="w-4 h-4" />
            Help
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center 
                            gap-2 transition-colors transform hover:scale-105">
            <Lock className="w-4 h-4" />
            Privacy
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center 
                            gap-2 transition-colors transform hover:scale-105">
            <FileText className="w-4 h-4" />
            Terms
          </button>
        </div>
      </div>
    </div>
  );
}