import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Globe2, User, ChevronDown, DollarSign, Clock, ArrowLeft,
  Calendar, Star, Shield, AlertTriangle, CheckCircle, XCircle,
  Info, Calendar as CalendarIcon, Clock3, Award, CreditCard,
  AlertOctagon, FileClock, Lock, MessageSquare
} from 'lucide-react';

interface VisaType {
  type: string;
  stayPeriod: number;
  validityPeriod: number;
  entryType: 'Single' | 'Multiple';
  fees: {
    omr: number;
    usd: number;
    eur: number;
    gbp: number;
    aed: number;
    sar: number;
    inr: number;
    pkr: number;
  };
  approvalIndex: 'Easy' | 'Moderate' | 'Difficult';
  easeOfApplication: 'Easy' | 'Moderate' | 'Complex';
  processingTime: string;
  overstayPenalty: {
    dailyFee: number;
    maxFee: number;
  };
  requirements: string[];
  benefits: string[];
  priority: boolean;
}

interface VisaOption {
  nationality: string;
  destination: string;
  visaRequired: boolean;
  nationalityId: number;
  destinationId: number;
  visaTypes: VisaType[];
  destinationFlag: string;
  nationalityFlag: string;
  lastUpdated: string;
  successRate: number;
}

type Currency = 'OMR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'INR' | 'PKR';
type Language = 'en' | 'ar';

const Visas: React.FC = () => {
  const [visaOptions, setVisaOptions] = useState<VisaOption[]>([]);
  const [selectedNationalityId, setSelectedNationalityId] = useState<number | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDestinationName, setSelectedDestinationName] = useState<string>('');
  const [selectedNationalityName, setSelectedNationalityName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [language, setLanguage] = useState<Language>('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'tourist' | 'business'>('all');

  const router = useRouter();

  const currencies: Record<Currency, { symbol: string; name: string }> = {
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    AED: { symbol: 'د.إ', name: 'UAE Dirham' },
    SAR: { symbol: 'ر.س', name: 'Saudi Riyal' },
    OMR: { symbol: 'ر.ع', name: 'Omani Rial' },
    INR: { symbol: '₹', name: 'Indian Rupee' },
    PKR: { symbol: '₨', name: 'Pakistani Rupee' }
  };

  const languages = {
    en: { name: 'English', nativeName: 'English' },
    ar: { name: 'Arabic', nativeName: 'العربية' }
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (!router.isReady) return;
    
    const { destination, nationality } = router.query;
    if (destination && nationality) {
      const decodedDestination = decodeURIComponent(destination as string);
      const decodedNationality = decodeURIComponent(nationality as string);
      
      setSelectedDestinationName(decodedDestination);
      setSelectedNationalityName(decodedNationality);

      // Auto-detect currency based on nationality
      const currencyMap: Record<string, Currency> = {
        'India': 'INR',
        'Pakistan': 'PKR',
        'UAE': 'AED',
        'Saudi Arabia': 'SAR',
        'Oman': 'OMR',
        'United Kingdom': 'GBP',
        'European Union': 'EUR'
      };
      
      if (currencyMap[decodedNationality]) {
        setSelectedCurrency(currencyMap[decodedNationality]);
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/visaOptions');
        const data = await response.json();
        
        if (Array.isArray(data.visaOptions)) {
          const filteredOptions = data.visaOptions.filter((option: VisaOption) => 
            !['Pakistan', 'Bangladesh'].includes(option.nationality)
          );
          setVisaOptions(filteredOptions);
        } else {
          setError('Invalid data format received');
        }
      } catch (error) {
        setError('Failed to load visa information');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const filteredVisaOptions = visaOptions.filter((option: VisaOption) => {
    if (!selectedDestinationName) return false;
    if (!option || typeof option !== 'object') return false;
  
    const matchesDestination =
      option.destination &&
      typeof option.destination === 'string' &&
      option.destination.toLowerCase() === selectedDestinationName.toLowerCase();
  
    const matchesNationality =
      option.nationality &&
      (option.nationality.toLowerCase() === 'all' || // Include "All" nationalities
        option.nationality.toLowerCase() === selectedNationalityName.toLowerCase());
  
    return matchesDestination && matchesNationality;
  });
  

  const getFilteredVisaTypes = () => {
    if (!filteredVisaOptions[0]) return [];
    
    return filteredVisaOptions[0].visaTypes.filter((visa: VisaType) => {
      if (activeTab === 'all') return true;
      return visa.type.toLowerCase().includes(activeTab);
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-OM', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  

  const getApprovalColor = (index: string) => {
    switch (index.toLowerCase()) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'difficult': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getApprovalIcon = (index: string) => {
    switch (index.toLowerCase()) {
      case 'easy': return <CheckCircle className="w-5 h-5" />;
      case 'moderate': return <AlertTriangle className="w-5 h-5" />;
      case 'difficult': return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 md:h-8 md:w-8 border-3 md:border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm md:text-base text-slate-700 font-serif">Processing your request...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center max-w-md w-full px-4">
          <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center text-red-700 border-2 border-red-200 rounded-full">
            <AlertOctagon className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3">{error}</h2>
          <div className="flex justify-center space-x-4 mt-6">
            <button 
              onClick={() => router.push('/select')}
              className="bg-blue-900 text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 transition-all font-serif"
            >
              Return to Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation Bar code remains the same... */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-8 md:py-12">
        {/* Header and Stats sections remain the same... */}

        {/* Visa Type Tabs */}
        <div className="flex space-x-2 mb-6 md:mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-serif text-sm md:text-base transition-all ${
              activeTab === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Visas
          </button>
          <button
            onClick={() => setActiveTab('tourist')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-serif text-sm md:text-base transition-all ${
              activeTab === 'tourist'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tourist Visas
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-serif text-sm md:text-base transition-all ${
              activeTab === 'business'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Business Visas
          </button>
        </div>

{/* Visa Cards Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {getFilteredVisaTypes().map((visa, index) => (
    <div
      key={index}
      className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md ${
        visa.priority ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Priority Badge */}
      {visa.priority && (
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white text-center text-xs md:text-sm py-1.5 font-serif">
          Priority Processing Available
        </div>
      )}

      {/* Card Header */}
      <div className="p-4 md:p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 font-serif">{visa.type}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs md:text-sm font-serif ${
              visa.entryType === 'Multiple'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {visa.entryType} Entry
          </span>
        </div>

        <div className="flex items-center space-x-4 text-sm font-serif">
          <div>
            <p className="text-slate-500">Processing Time</p>
            <p className="font-medium text-slate-900">{visa.processingTime}</p>
          </div>
          <div>
            <p className="text-slate-500">Stay Period</p>
            <p className="font-medium text-slate-900">{visa.stayPeriod} days</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Fee Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 font-serif">Visa Fee</span>
            <span className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
              {formatCurrency(visa.fees.omr)}
            </span>
          </div>
          <div className="text-xs md:text-sm text-slate-500 font-serif">
            Overstay Penalty: {formatCurrency(visa.overstayPenalty.dailyFee)} per day
            <br />
            Maximum Penalty: {formatCurrency(visa.overstayPenalty.maxFee)}
          </div>
        </div>

        {/* Requirements Preview */}
        <div>
          <h4 className="font-medium text-slate-900 mb-3 font-serif">Key Requirements</h4>
          <ul className="space-y-2">
            {visa.requirements.slice(0, 3).map((req, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-600 font-serif">{req}</span>
              </li>
            ))}
            {visa.requirements.length > 3 && (
              <li className="text-sm text-blue-900 hover:text-blue-800 cursor-pointer font-serif">
                +{visa.requirements.length - 3} more requirements...
              </li>
            )}
          </ul>
        </div>

        {/* Approval Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500 mb-1 font-serif">Approval Rate</p>
            <div
              className={`flex items-center space-x-1 ${getApprovalColor(
                visa.approvalIndex
              )}`}
            >
              {getApprovalIcon(visa.approvalIndex)}
              <span className="font-medium font-serif">{visa.approvalIndex}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1 font-serif">Application</p>
            <div
              className={`flex items-center space-x-1 ${
                visa.easeOfApplication === 'Easy'
                  ? 'text-green-600'
                  : visa.easeOfApplication === 'Moderate'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              <Star className="w-4 h-4" />
              <span className="font-medium font-serif">{visa.easeOfApplication}</span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={() =>
            router.push({
              pathname: '/login',
              query: {
                destination: selectedDestinationName,
                nationality: selectedNationalityName,
                visaType: visa.type,
              },
            })
          }
          className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-all flex items-center justify-center space-x-2 font-serif text-sm md:text-base"
        >
          <span>Start Application</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  ))}
</div>


        {/* No Results State */}
        {getFilteredVisaTypes().length === 0 && (
          <div className="bg-yellow-50 rounded-xl p-6 md:p-8 text-center">
            <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2 font-serif">
              No Visa Options Found
            </h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6 font-serif">
              We couldn't find any visa options matching your criteria. 
              Please try adjusting your selection or contact our support team for assistance.
            </p>
            <button
              onClick={() => router.push('/select')}
              className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-all font-serif"
            >
              Change Selection
            </button>
          </div>
        )}

        {/* Trust Indicators Section */}
        <div className="border-t border-slate-100 mt-12 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-900 mx-auto mb-3" />
              <h3 className="font-serif font-semibold text-slate-900 text-sm md:text-base">Government Authorized</h3>
              <p className="text-xs md:text-sm text-slate-500">Official partner</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-serif font-semibold text-slate-900 text-sm md:text-base">98% Success Rate</h3>
              <p className="text-xs md:text-sm text-slate-500">High approval ratio</p>
            </div>
            <div className="text-center">
              <Clock3 className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-serif font-semibold text-slate-900 text-sm md:text-base">24/7 Support</h3>
              <p className="text-xs md:text-sm text-slate-500">Always available</p>
            </div>
            <div className="text-center">
              <Award className="w-6 h-6 md:w-8 md:h-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-serif font-semibold text-slate-900 text-sm md:text-base">ISO 27001</h3>
              <p className="text-xs md:text-sm text-slate-500">Certified secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Button */}
      <button 
        className="fixed bottom-6 right-6 bg-blue-900 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-blue-800 transition-all z-50 flex items-center space-x-2"
        onClick={() => console.log('Open chat')}
      >
        <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
        <span className="hidden sm:inline text-sm font-serif">Chat with Us</span>
      </button>
    </div>
  );
};

export default Visas;
