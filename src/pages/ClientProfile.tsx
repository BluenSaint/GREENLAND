import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Edit
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClientData {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    ssn: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  caseInfo: {
    caseNumber: string;
    status: string;
    assignedSpecialist: string;
    startDate: string;
    packageType: string;
    monthlyFee: number;
    contractSigned: boolean;
    contractSignedDate: string;
  };
  creditScores: {
    current: {
      equifax: number;
      experian: number;
      transunion: number;
      average: number;
      lastUpdated: string;
    };
    initial: {
      equifax: number;
      experian: number;
      transunion: number;
      average: number;
      date: string;
    };
    history: Array<{
      date: string;
      score: number;
    }>;
  };
  negativeItems: {
    total: number;
    removed: number;
    inProgress: number;
    pending: number;
    items: Array<{
      id: string;
      type: string;
      creditor: string;
      account: string;
      amount: number;
      status: string;
      bureau: string;
      disputeReason: string;
      dateReported: string;
      dateRemoved?: string;
      lastDisputed?: string;
    }>;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    size: string;
  }>;
}

const ClientProfile: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      const response = await fetch('/data/clients.json');
      const clients = await response.json();
      const clientData = clients.find((c: ClientData) => c.id === clientId);
      setClient(clientData);
    } catch (error) {
      console.error('Failed to load client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4 mr-2" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getItemStatusBadge = (status: string) => {
    const statusConfig = {
      removed: { bg: 'bg-green-100', text: 'text-green-800' },
      in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      pending: { bg: 'bg-blue-100', text: 'text-blue-800' },
      verified: { bg: 'bg-red-100', text: 'text-red-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Client not found</div>
        <Link to="/clients" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
          Return to Client Management
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'negative-items', name: 'Negative Items', icon: AlertTriangle },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'communications', name: 'Communications', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/clients"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {client.personalInfo.firstName} {client.personalInfo.lastName}
            </h1>
            <p className="text-gray-600">Case #{client.caseInfo.caseNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(client.caseInfo.status)}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Client</span>
          </button>
        </div>
      </div>

      {/* Client Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-900">{client.personalInfo.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-900">{client.personalInfo.phone}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="text-sm text-gray-900">
                <div>{client.personalInfo.address.street}</div>
                <div>{client.personalInfo.address.city}, {client.personalInfo.address.state} {client.personalInfo.address.zipCode}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Case Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">Start Date</div>
                <div className="text-sm text-gray-600">{new Date(client.caseInfo.startDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">Monthly Fee</div>
                <div className="text-sm text-gray-600">${client.caseInfo.monthlyFee}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">Package</div>
                <div className="text-sm text-gray-600">{client.caseInfo.packageType}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Score Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {client.creditScores.current.average}
            </div>
            <div className="text-sm text-gray-600 mb-4">Current Average</div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="font-medium">Equifax</div>
                <div className="text-gray-600">{client.creditScores.current.equifax}</div>
              </div>
              <div>
                <div className="font-medium">Experian</div>
                <div className="text-gray-600">{client.creditScores.current.experian}</div>
              </div>
              <div>
                <div className="font-medium">TransUnion</div>
                <div className="text-gray-600">{client.creditScores.current.transunion}</div>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <span className="text-green-600 font-medium">
                +{client.creditScores.current.average - client.creditScores.initial.average} points
              </span>
              <span className="text-gray-600"> improvement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Credit Score Chart */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Credit Score Progress</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={client.creditScores.history}>
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

              {/* Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{client.negativeItems.removed}</div>
                  <div className="text-sm text-gray-600">Items Removed</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{client.negativeItems.inProgress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{client.negativeItems.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          )}

          {/* Negative Items Tab */}
          {activeTab === 'negative-items' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Negative Items</h4>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Add New Dispute
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type / Creditor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bureau
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {client.negativeItems.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.type}</div>
                            <div className="text-sm text-gray-500">{item.creditor}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.account}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {item.bureau}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getItemStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Documents</h4>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Upload Document
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {client.documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <button className="text-gray-400 hover:text-blue-600">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">{doc.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{doc.type}</div>
                    <div className="text-xs text-gray-400">
                      Uploaded {new Date(doc.uploadDate).toLocaleDateString()} • {doc.size}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communications Tab */}
          {activeTab === 'communications' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Communications</h4>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Send Message
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">Welcome Email Sent</div>
                    <div className="text-xs text-gray-500">2 days ago</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Welcome to CreditFix Pro! Your case has been assigned and we're ready to start improving your credit.
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">Dispute Letter Sent</div>
                    <div className="text-xs text-gray-500">1 week ago</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Dispute letter sent to Equifax regarding Capital One late payment item.
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

export default ClientProfile;
