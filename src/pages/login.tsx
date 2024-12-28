import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Check, Phone, Mail, ChevronDown,
  RefreshCw, Shield, Smartphone, HelpCircle, Lock, FileText,
  UserCircle, LogOut, ChevronRight
} from 'lucide-react';

type User = {
  name: string;
  phone_number: string;
};

const countries = [
  { code: '+968', flag: '🇴🇲', name: 'Oman', maxLength: 8 },
  { code: '+91', flag: 'IN', name: 'India', maxLength: 10 },

  { code: '+91', flag: '🇮🇳', name: 'India', maxLength: 10 },
  { code: '+971', flag: '🇦🇪', name: 'UAE', maxLength: 9 },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia', maxLength: 9 },
  { code: '+974', flag: '🇶🇦', name: 'Qatar', maxLength: 8 },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain', maxLength: 8 }
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    firstName: '',
    phoneNumber: '',
    email: '',
    destination: searchParams.get('destination') || '',
    nationality: searchParams.get('nationality') || '',
    visaType: searchParams.get('visaType') || ''
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
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('sessionToken');
      if (token) {
        try {
          const response = await fetch('/api/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          const result = await response.json();

          if (response.ok) {
            setLoggedInUser(result.user);
            setTimeout(() => {
              handleContinue();
            }, 3000);
          }
        } catch (error) {
          console.error('Session check failed:', error);
          localStorage.removeItem('sessionToken');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

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
        setErrorMessage(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = async (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (newOtpDigits.every(digit => digit !== '')) {
      const enteredOtp = newOtpDigits.join('');
      try {
        const response = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: formData.phoneNumber,
            countryCode: selectedCountry.code,
            otp: enteredOtp,
            firstName: formData.firstName,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem('sessionToken', result.token);
          setLoggedInUser(result.user);
          handleContinue();
        } else {
          setErrorMessage(result.error || 'Invalid verification code');
          setOtpDigits(['', '', '', '', '', '']);
          otpInputRefs.current[0]?.focus();
        }
      } catch (error) {
        setErrorMessage('Verification failed');
        setOtpDigits(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      }
    }
  };

  const handleResendOtp = () => {
    setCountdown(60);
    setCanResend(false);
    handleSendOTP(new Event('submit') as any);
  };

  const handleContinue = () => {
    if (!loggedInUser) return;
  
    const queryParams = new URLSearchParams({
      phone: loggedInUser.phone_number,
      firstName: loggedInUser.name,
      email: formData.email || '',
      destination: searchParams.get('destination') || '',
      nationality: searchParams.get('nationality') || '',
      visaType: searchParams.get('visaType') || ''
    });
  
    router.push(`/upload-documents?${queryParams.toString()}`);
  };
  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    setLoggedInUser(null);
    setCurrentStep('details');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-blue-600">
          <RefreshCw className="w-8 h-8" />
        </div>
      </div>
    );
  }

  if (loggedInUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <UserCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {loggedInUser.name}!
            </h1>
            
            <p className="text-gray-600 mb-6">
              You can apply for visas using this account.<br/>
              Phone: {loggedInUser.phone_number}
            </p>

            <div className="space-y-4">
              <button
                onClick={handleContinue}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                         flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                Continue to Application
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-3 border-2 border-red-500 text-red-500 rounded-lg
                         flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Use Different Account
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Automatically continuing to your application in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <button 
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center 
                       gap-2 transition-colors transform hover:scale-105"
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </button>
          <button 
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center 
                       gap-2 transition-colors transform hover:scale-105"
          >
            <Lock className="w-4 h-4" />
            Privacy
          </button>
          <button 
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center 
                       gap-2 transition-colors transform hover:scale-105"
          >
            <FileText className="w-4 h-4" />
            Terms
          </button>
        </div>
      </div>
    </div>
  );
}