import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  Calendar,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ClientPortal: React.FC = () => {
  const { user } = useAuthStore();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadClientData();
  }, [user]);

  const loadClientData = async () => {
    try {
      const response = await fetch('/data/clients.json');
      const clients = await response.json();
      const data = clients.find((c: any) => c.id === user?.id);
      setClientData(data);
    } catch (error) {
      console.error('Failed to load client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'progress', name: 'Progress Tracking', icon: Target },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'communication', name: 'Messages', icon: MessageSquare },
    { id: 'specialist', name: 'My Specialist', icon: User },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Client data not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {clientData.personalInfo.firstName}!</h1>
        <p className="text-blue-100">
          Track your credit repair journey and see your progress over time.
        </p>
        <div className="mt-4 flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{clientData.creditScores.current.average}</div>
            <div className="text-blue-200 text-sm">Current Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300">
              +{clientData.creditScores.current.average - clientData.creditScores.initial.average}
            </div>
            <div className="text-blue-200 text-sm">Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{clientData.negativeItems.removed}</div>
            <div className="text-blue-200 text-sm">Items Removed</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Current Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {clientData.creditScores.current.average}
                      </div>
                      <div className="text-sm text-gray-600">Average Credit Score</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {clientData.negativeItems.removed}
                      </div>
                      <div className="text-sm text-gray-600">Items Removed</div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {clientData.negativeItems.inProgress}
                      </div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bureau Scores */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Bureau Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">Equifax</div>
                      <div className="text-3xl font-bold text-blue-600 my-2">
                        {clientData.creditScores.current.equifax}
                      </div>
                      <div className="text-sm text-gray-600">
                        {clientData.creditScores.current.equifax > clientData.creditScores.initial.equifax ? '+' : ''}
                        {clientData.creditScores.current.equifax - clientData.creditScores.initial.equifax} points
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">Experian</div>
                      <div className="text-3xl font-bold text-green-600 my-2">
                        {clientData.creditScores.current.experian}
                      </div>
                      <div className="text-sm text-gray-600">
                        {clientData.creditScores.current.experian > clientData.creditScores.initial.experian ? '+' : ''}
                        {clientData.creditScores.current.experian - clientData.creditScores.initial.experian} points
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">TransUnion</div>
                      <div className="text-3xl font-bold text-purple-600 my-2">
                        {clientData.creditScores.current.transunion}
                      </div>
                      <div className="text-sm text-gray-600">
                        {clientData.creditScores.current.transunion > clientData.creditScores.initial.transunion ? '+' : ''}
                        {clientData.creditScores.current.transunion - clientData.creditScores.initial.transunion} points
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Download className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Download Reports</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Upload className="w-8 h-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Upload Documents</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Message Specialist</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Schedule Call</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Tracking Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Credit Score Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={clientData.creditScores.history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Negative Items Progress */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Negative Items Progress</h3>
                <div className="space-y-4">
                  {clientData.negativeItems.items.map((item: any, index: number) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.type}</h4>
                          <p className="text-sm text-gray-600">{item.creditor} • {item.account}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'removed' 
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.status === 'removed' && item.dateRemoved && (
                          <span>Removed on {new Date(item.dateRemoved).toLocaleDateString()}</span>
                        )}
                        {item.status === 'in_progress' && item.lastDisputed && (
                          <span>Last disputed on {new Date(item.lastDisputed).toLocaleDateString()}</span>
                        )}
                        {item.status === 'pending' && (
                          <span>Dispute pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Documents</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Document</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientData.documents.map((doc: any) => (
                  <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <button className="text-gray-400 hover:text-blue-600">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{doc.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded {new Date(doc.uploadDate).toLocaleDateString()} • {doc.size}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>New Message</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">Michael Davis</h4>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Good news! We've successfully removed the Capital One late payment from your Equifax report. 
                        This should help improve your credit score in the next update.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">You</h4>
                        <span className="text-sm text-gray-500">1 day ago</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Thank you for the update on my case. When can I expect to see the next dispute letters sent out?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">Michael Davis</h4>
                        <span className="text-sm text-gray-500">3 days ago</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Welcome to CreditFix Pro! I'm your assigned credit specialist and I'll be helping you 
                        throughout your credit repair journey. Let me know if you have any questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Specialist Tab */}
          {activeTab === 'specialist' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">My Credit Specialist</h3>
              
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src="/images/consultant.jpg"
                    alt="Michael Davis"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">Michael Davis</h4>
                    <p className="text-gray-600 mb-4">Senior Credit Specialist</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">michael@creditfix.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">(555) 123-4567</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">
                      Michael has over 8 years of experience in credit repair and has helped hundreds of clients 
                      improve their credit scores. He specializes in complex dispute cases and has a 94% success rate.
                    </p>

                    <div className="flex space-x-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule Call</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Information */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Case Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Case Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Case Number:</span>
                        <span className="text-gray-900">{clientData.caseInfo.caseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="text-gray-900">{new Date(clientData.caseInfo.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package:</span>
                        <span className="text-gray-900">{clientData.caseInfo.packageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Fee:</span>
                        <span className="text-gray-900">${clientData.caseInfo.monthlyFee}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Progress Summary</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items Removed:</span>
                        <span className="text-green-600 font-medium">{clientData.negativeItems.removed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">In Progress:</span>
                        <span className="text-yellow-600 font-medium">{clientData.negativeItems.inProgress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Score Improvement:</span>
                        <span className="text-blue-600 font-medium">
                          +{clientData.creditScores.current.average - clientData.creditScores.initial.average} points
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
