import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Destination, Nationality, VisaType, VisaRequirements } from '../types/types';
import TestimonialSlider from './TestimonialSlider';
import Footer from './Footer';
import { Search, Globe, Users, Clock, ChevronDown, ArrowRight } from 'lucide-react';

const PremiumVisaApp = () => {
  // States remain the same as your original code
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
  const [searchTerm, setSearchTerm] = useState('');
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
    if (!selectedNationality) {
      return destinations.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return destinations.filter((dest) =>
      selectedNationality.eligibleDestinations.includes(dest.id) &&
      dest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    setSelectedVisaType(null);
    setSelectedNationality(null);
    setIsDestinationOpen(false);
    setSearchTerm('');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 text-lg">Processing your request...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-red-50 rounded-full">
            <span className="text-2xl text-red-600">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Temporary Interruption</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      icon: <Users className="w-6 h-6 text-blue-600" />,
      value: '99.85%', 
      label: 'Success Guarantee', 
      description: 'Proven visa approval track record since 2013' 
    },
    { 
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      value: '24/7', 
      label: 'Global Helpdesk', 
      description: 'Dedicated support across Oman, India, and Bahrain' 
    },
    { 
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      value: '70+', 
      label: 'International Reach', 
      description: 'Trusted visa solutions worldwide' 
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div className="flex items-center">
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                zip<span className="text-gray-900">visa.com</span>
              </span>
              <div className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            </div>
            
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full
                       transition-all duration-300 text-sm font-medium hover:shadow-lg hover:scale-[1.02]"
            >
              Track Visa
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Visa Made <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your destination, and we'll guide you through a hassle-free visa process.
              Your journey to the world starts here.
            </p>
          </div>

          {/* Selection Cards */}
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Destination Selection */}
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-1 hover:shadow-md transition-all duration-300">
              <label className="block text-sm font-medium text-gray-700 px-4 pt-3 pb-2">
                Choose Your Destination Country
              </label>
              <div
                onClick={() => setIsDestinationOpen(true)}
                className="group cursor-pointer"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  {selectedDestination ? (
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl">
                      <span className="text-2xl">{selectedDestination.flag}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl">
                      <Globe className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <span className="block text-lg text-gray-900">
                      {selectedDestination ? selectedDestination.name : "Where do you want to travel?"}
                    </span>
                    {selectedDestination && (
                      <span className="text-sm text-gray-500">
                        Processing time: {selectedDestination.visaTypes[0]?.processingTime || "Standard"}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 
                    ${isDestinationOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Destination Dropdown */}
              {isDestinationOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search destinations..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 
                                 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {getEligibleDestinations().map((destination) => (
                        <div
                          key={destination.id}
                          onClick={() => handleDestinationSelect(destination)}
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl">
                            <span className="text-2xl">{destination.flag}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{destination.name}</div>
                            <div className="text-sm text-gray-500">
                              Processing: {destination.visaTypes[0]?.processingTime || "Standard"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nationality Selection */}
            {selectedDestination && (
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-1 hover:shadow-md 
                            transition-all duration-300 animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 px-4 pt-3 pb-2">
                  Select Your Nationality
                </label>
                <div
                  onClick={() => setIsNationalityOpen(true)}
                  className="group cursor-pointer"
                >
                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                    {selectedNationality ? (
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl">
                        <span className="text-2xl">{selectedNationality.flag}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <span className="flex-1 text-lg text-left text-gray-900">
                      {selectedNationality ? selectedNationality.name : "Which country are you from?"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 
                      ${isNationalityOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Nationality Dropdown */}
                {isNationalityOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4">
                      <div className="max-h-96 overflow-y-auto">
                        {nationalities.map((nationality) => (
                          <div
                            key={nationality.id}
                            onClick={() => handleNationalitySelect(nationality)}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-all"
                          >
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl">
                              <span className="text-2xl">{nationality.flag}</span>
                            </div>
                            <span className="font-medium text-gray-900">{nationality.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md 
                         transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">{stat.icon}
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {stat.value}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{stat.label}</h3>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

{/* Testimonials Section */}
<section className="bg-gray-50 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        What Our Clients Say
      </h2>
    </div>
    <TestimonialSlider />
  </div>
</section>

      {/* WhatsApp Chat Button */}
      <a 
        href="https://wa.me/zip.om" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          className="w-6 h-6"
          fill="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.03L.789 23.5l4.47-1.495A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.484 0-4.789-.78-6.681-2.109l-.479-.279-3.082 1.027 1.028-3.082-.279-.479A9.955 9.955 0 0 1 2 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>

      {/* Footer */}
      <Footer />
      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default PremiumVisaApp;