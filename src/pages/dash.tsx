import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Clock,
  CreditCard,
  FileText,
  LogOut,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCcw,
  UserCircle
} from 'lucide-react';

interface Application {
  id: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  submittedDate: string;
  destination: string;
  destinationFlag: string;
  visaType: string;
  processingTime: string;
}

interface UserSession {
  name: string;
  phone_number: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const verifySession = async () => {
      try {
        const response = await fetch('/api/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Invalid session');
        }

        const data = await response.json();
        setUser(data.user);
        // Fetch applications here
        setLoading(false);
      } catch (error) {
        router.push('/login');
      }
    };

    verifySession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                zip<span className="text-gray-900">visa.com</span>
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse ml-1"></div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('sessionToken');
                  router.push('/login');
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <UserCircle className="w-8 h-8 text-gray-400" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {user?.name}
            </h1>
          </div>
          <p className="text-gray-600">
            Manage your visa applications and track their status
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Applications</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Processing Time</p>
                <p className="text-2xl font-semibold text-gray-900">48h</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">99.8%</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">45 OMR</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {[
              {
                id: '1',
                type: 'Tourist Visa',
                status: 'processing',
                submittedDate: '2024-12-20',
                destination: 'Oman',
                destinationFlag: '🇴🇲',
                visaType: '30 Days Tourist Visa',
                processingTime: '1-2 Business Days'
              },
              {
                id: '2',
                type: 'Tourist Visa',
                status: 'approved',
                submittedDate: '2024-12-15',
                destination: 'UAE',
                destinationFlag: '🇦🇪',
                visaType: '60 Days Tourist Visa',
                processingTime: '3-5 Business Days'
              }
            ].map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{application.destinationFlag}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{application.destination} - {application.visaType}</h3>
                      <p className="text-sm text-gray-500">Submitted on {new Date(application.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm
                      ${application.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                        application.status === 'approved' ? 'bg-green-50 text-green-700' :
                        application.status === 'rejected' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'}`}
                    >
                      {application.status === 'processing' && <RefreshCcw className="w-4 h-4" />}
                      {application.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                      {application.status === 'rejected' && <XCircle className="w-4 h-4" />}
                      {application.status === 'pending' && <AlertCircle className="w-4 h-4" />}
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <button
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      onClick={() => router.push(`/application/${application.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;