import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Destination, Nationality, VisaType, VisaRequirements } from '../../types/types';
import TestimonialSlider from './TestimonialSlider';
import Footer from './Footer';

const PremiumVisaApp = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [requirements, setRequirements] = useState<{ [key: string]: VisaRequirements }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedNationality, setSelectedNationality] = useState<Nationality | null>(null);
  const [selectedVisaType, setSelectedVisaType] = useState<VisaType | null>(null);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isNationalityOpen, setIsNationalityOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const destResponse = await fetch('/data/destinations.json');
        const destData = await destResponse.json();
        const natResponse = await fetch('/data/nationalities.json');
        const natData = await natResponse.json();
        const reqResponse = await fetch('/data/visa-requirements.json');
        const reqData = await reqResponse.json();
        setDestinations(destData.destinations || []);
        setNationalities(natData.nationalities || []);
        setRequirements(reqData.requirements || {});
        setLoading(false);
      } catch (err) {
        setError('Our global network is temporarily experiencing difficulties. We apologize for the inconvenience.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getEligibleDestinations = () => {
    if (!selectedNationality) return destinations;
    return destinations.filter((dest) =>
      selectedNationality.eligibleDestinations.includes(dest.id)
    );
  };

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    setSelectedVisaType(null);
    setSelectedNationality(null);
    setIsDestinationOpen(false);
  };

  const handleNationalitySelect = (nationality: Nationality) => {
    setSelectedNationality(nationality);
    setSelectedVisaType(null);
    setIsNationalityOpen(false);
    router.push({
      pathname: '/visas',
      query: {
        destination: encodeURIComponent(selectedDestination?.name || ''),
        nationality: encodeURIComponent(nationality.name)
      },
    });
  };

  const toggleDestinationDropdown = () => {
    setIsDestinationOpen((prevState) => !prevState);
  };

  const toggleNationalityDropdown = () => {
    setIsNationalityOpen((prevState) => !prevState);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 md:h-8 md:w-8 border-3 md:border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm md:text-base text-slate-700 font-serif">Processing your request...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md w-full">
          <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center text-red-700 border-2 border-red-200 rounded-full">
            <span className="text-lg font-serif">!</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif text-slate-900 mb-2">Temporary Interruption</h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { value: '99.85%', label: 'Success Guarantee', description: 'Proven visa approval track record since 2013' },
    { value: '24/7', label: 'Global Helpdesk', description: 'Dedicated support across Oman, India, and Bahrain' },
    { value: '70+', label: 'International Reach', description: 'Trusted visa solutions worldwide' },
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
              <div className="flex items-center space-x-3">
                <Link href="/terms-of-service" className="text-xs md:text-sm font-serif text-slate-600 hover:text-blue-900 transition-colors">
                  Terms
                </Link>
                <Link href="/cookie-policy" className="text-xs md:text-sm font-serif text-slate-600 hover:text-blue-900 transition-colors">
                  Cookies
                </Link>
                <Link href="/disclaimer" className="text-xs md:text-sm font-serif text-slate-600 hover:text-blue-900 transition-colors">
                  Disclaimer
                </Link>
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
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-8 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
            Your Global Journey Starts Here
          </h1>
          <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-4">
            Begin your visa process by selecting your destination. We'll guide you through every step of your international travel.
          </p>

          <div className="space-y-4 md:space-y-6 max-w-xl mx-auto px-3 md:px-0 mb-8 md:mb-12">
            <div className="text-left">
              <label className="block text-xs md:text-sm font-serif font-medium text-slate-700 mb-2 md:mb-3">
                Choose Your Destination Country
              </label>
              <div className="relative">
                <div
                  className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200 shadow-sm"
                  onClick={toggleDestinationDropdown}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base md:text-lg font-serif text-slate-700">
                      {selectedDestination ? selectedDestination.name : "Where do you want to travel?"}
                    </span>
                  </div>
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isDestinationOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 md:mt-2 bg-white rounded-lg md:rounded-xl shadow-xl border border-slate-100 z-50 max-h-64 md:max-h-96 overflow-y-auto">
                    <div className="p-1 md:p-2">
                      {getEligibleDestinations().map((destination) => (
                        <div
                          key={destination.id}
                          className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50 rounded-lg cursor-pointer"
                          onClick={() => handleDestinationSelect(destination)}
                        >
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <span className="text-xl md:text-2xl">{destination.flag}</span>
                            <div>
                              <div className="font-serif font-medium text-slate-900 text-sm md:text-base">
                                {destination.name}
                              </div>
                              <div className="text-xs md:text-sm text-slate-500">
                                Processing: {destination.visaTypes[0]?.processingTime || "Standard"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedDestination && (
              <div className="text-left">
                <label className="block text-xs md:text-sm font-serif font-medium text-slate-700 mb-2 md:mb-3">
                  Select Your Nationality
                </label>
                <div className="relative">
                  <div
                    className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200 shadow-sm"
                    onClick={toggleNationalityDropdown}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-base md:text-lg font-serif text-slate-700">
                        {selectedNationality ? selectedNationality.name : "Which country are you from?"}
                      </span>
                    </div>
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {isNationalityOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 md:mt-2 bg-white rounded-lg md:rounded-xl shadow-xl border border-slate-100 z-50 max-h-64 md:max-h-96 overflow-y-auto">
                      <div className="p-1 md:p-2">
                        {nationalities.map((nationality) => (
                          <div
                            key={nationality.id}
                            className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50 rounded-lg cursor-pointer"
                            onClick={() => handleNationalitySelect(nationality)}
                          >
                            <div className="flex items-center space-x-2 md:space-x-3">
                              <span className="text-xl md:text-2xl">{nationality.flag}</span>
                              <div className="font-serif font-medium text-slate-900 text-sm md:text-base">
                                {nationality.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="text-xl md:text-2xl font-bold font-serif text-blue-900">{stat.value}</div>
                <div className="text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          <h2 className="text-xl md:text-3xl font-serif font-bold text-center text-slate-900 mb-6 md:mb-8">
            Travelers' Trusted Choice
          </h2>
          <TestimonialSlider />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PremiumVisaApp;