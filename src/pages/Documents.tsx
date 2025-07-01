import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Search, 
  Filter,
  Folder,
  Plus,
  File,
  PaperclipIcon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  size: string;
  clientId?: string;
  clientName?: string;
  url?: string;
}

const Documents: React.FC = () => {
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const loadDocuments = async () => {
    try {
      if (user?.role === 'client') {
        // Load client-specific documents
        const clientsResponse = await fetch('/data/clients.json');
        const clients = await clientsResponse.json();
        const clientData = clients.find((c: any) => c.id === user.id);
        
        if (clientData) {
          setDocuments(clientData.documents.map((doc: any) => ({
            ...doc,
            category: getDocumentCategory(doc.type)
          })));
        }
      } else {
        // Load all documents for admin/specialist
        const clientsResponse = await fetch('/data/clients.json');
        const clients = await clientsResponse.json();
        
        const allDocuments: Document[] = [];
        clients.forEach((client: any) => {
          client.documents.forEach((doc: any) => {
            allDocuments.push({
              ...doc,
              clientId: client.id,
              clientName: `${client.personalInfo.firstName} ${client.personalInfo.lastName}`,
              category: getDocumentCategory(doc.type)
            });
          });
        });
        
        // Add compliance documents
        allDocuments.push(
          {
            id: 'comp-001',
            name: 'CROA Contract Template',
            type: 'contract_template',
            category: 'Compliance',
            uploadDate: '2024-01-01',
            size: '45KB',
            url: '/compliance/croa-contract.pdf'
          },
          {
            id: 'comp-002',
            name: 'Consumer Rights Disclosure',
            type: 'disclosure',
            category: 'Compliance',
            uploadDate: '2024-01-01',
            size: '32KB',
            url: '/compliance/consumer-rights.pdf'
          },
          {
            id: 'comp-003',
            name: 'Dispute Letter Templates',
            type: 'templates',
            category: 'Templates',
            uploadDate: '2024-01-01',
            size: '156KB',
            url: '/templates/dispute-letters.pdf'
          }
        );
        
        setDocuments(allDocuments);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentCategory = (type: string): string => {
    const categoryMap: { [key: string]: string } = {
      contract: 'Contracts',
      identification: 'Identification',
      address_verification: 'Address Verification',
      credit_report: 'Credit Reports',
      dispute_letter: 'Dispute Letters',
      response: 'Bureau Responses',
      contract_template: 'Compliance',
      disclosure: 'Compliance',
      templates: 'Templates'
    };
    return categoryMap[type] || 'Other';
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract':
      case 'contract_template':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'identification':
        return <File className="w-8 h-8 text-green-600" />;
      case 'credit_report':
        return <FileText className="w-8 h-8 text-purple-600" />;
      case 'dispute_letter':
        return <PaperclipIcon className="w-8 h-8 text-orange-600" />;
      default:
        return <FileText className="w-8 h-8 text-gray-600" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.clientName && doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(documents.map(doc => doc.category)))];

  const getDocumentStats = () => {
    return {
      total: documents.length,
      contracts: documents.filter(d => d.category === 'Contracts').length,
      creditReports: documents.filter(d => d.category === 'Credit Reports').length,
      disputeLetters: documents.filter(d => d.category === 'Dispute Letters').length,
    };
  };

  const stats = getDocumentStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Stats */}
      {user?.role !== 'client' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.contracts}</div>
            <div className="text-sm text-gray-600">Contracts</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">{stats.creditReports}</div>
            <div className="text-sm text-gray-600">Credit Reports</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">{stats.disputeLetters}</div>
            <div className="text-sm text-gray-600">Dispute Letters</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white rounded-xl shadow-sm border">
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  {getDocumentIcon(doc.type)}
                  <div className="flex items-center space-x-1">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-green-600 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                    {user?.role !== 'client' && (
                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                  <div className="text-sm text-gray-600">{doc.category}</div>
                  {doc.clientName && (
                    <div className="text-sm text-blue-600">{doc.clientName}</div>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search criteria.' 
                : 'Get started by uploading a document.'}
            </p>
            {(!searchTerm && categoryFilter === 'all') && (
              <div className="mt-6">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="-ml-1 mr-2 h-5 w-5" />
                  Upload Document
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter document name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="contracts">Contracts</option>
                  <option value="identification">Identification</option>
                  <option value="address_verification">Address Verification</option>
                  <option value="credit_reports">Credit Reports</option>
                  <option value="dispute_letters">Dispute Letters</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {user?.role !== 'client' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client (Optional)</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Client</option>
                    <option value="1">John Smith</option>
                    <option value="2">Emily Rodriguez</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
