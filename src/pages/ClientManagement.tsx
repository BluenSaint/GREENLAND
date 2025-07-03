import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail
} from 'lucide-react';
import { clientService, creditScoreService, negativeItemService } from '../services/clientService';
import type { Client } from '../lib/supabase';

interface ClientWithStats extends Client {
  currentScore?: number;
  initialScore?: number;
  negativeItemsRemoved?: number;
  negativeItemsTotal?: number;
  negativeItemsInProgress?: number;
}

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const clientsData = await clientService.getClients();
      
      // Load additional stats for each client
      const clientsWithStats = await Promise.all(
        clientsData.map(async (client) => {
          try {
            const [creditScores, negativeItems] = await Promise.all([
              creditScoreService.getCreditScores(client.id),
              negativeItemService.getNegativeItems(client.id)
            ]);

            const currentScore = creditScores[creditScores.length - 1];
            const initialScore = creditScores[0];

            return {
              ...client,
              currentScore: currentScore?.average,
              initialScore: initialScore?.average,
              negativeItemsRemoved: negativeItems.filter(item => item.status === 'removed').length,
              negativeItemsTotal: negativeItems.length,
              negativeItemsInProgress: negativeItems.filter(item => item.status === 'in_progress').length
            };
          } catch (error) {
            console.error(`Error loading stats for client ${client.id}:`, error);
            return client;
          }
        })
      );

      setClients(clientsWithStats);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients
    .filter(client => {
      const personalInfo = client.personal_info || {};
      const matchesSearch = 
        personalInfo.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personalInfo.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personalInfo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.case_number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const aName = `${a.personal_info?.lastName || ''} ${a.personal_info?.firstName || ''}`;
          const bName = `${b.personal_info?.lastName || ''} ${b.personal_info?.firstName || ''}`;
          return aName.localeCompare(bName);
        case 'score':
          return (b.currentScore || 0) - (a.currentScore || 0);
        case 'startDate':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        default:
          return 0;
      }
    });

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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getScoreTrend = (current?: number, initial?: number) => {
    if (!current || !initial) return <span className="text-gray-500">No data</span>;
    
    const change = current - initial;
    if (change > 0) {
      return (
        <span className="inline-flex items-center text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          +{change}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="inline-flex items-center text-red-600">
          <TrendingDown className="w-4 h-4 mr-1" />
          {change}
        </span>
      );
    }
    return <span className="text-gray-500">No change</span>;
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="score">Sort by Score</option>
              <option value="startDate">Sort by Start Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{clients.length}</div>
          <div className="text-sm text-gray-600">Total Clients</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {clients.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Cases</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">
            {clients.length > 0 ? Math.round(
              clients.reduce((sum, c) => sum + (c.currentScore || 0), 0) / 
              clients.filter(c => c.currentScore).length
            ) : 0}
          </div>
          <div className="text-sm text-gray-600">Avg. Credit Score</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">
            {clients.reduce((sum, c) => sum + (c.negativeItemsRemoved || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Items Removed</div>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
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
              {filteredClients.map((client) => {
                const personalInfo = client.personal_info || {};
                return (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {personalInfo.firstName} {personalInfo.lastName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-4">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {personalInfo.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {personalInfo.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.case_number}</div>
                      <div className="text-sm text-gray-500">
                        Started {new Date(client.start_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-semibold text-gray-900">
                        {client.currentScore || 'N/A'}
                      </div>
                      <div className="text-sm">
                        {getScoreTrend(client.currentScore, client.initialScore)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {client.negativeItemsRemoved || 0}/{client.negativeItemsTotal || 0} removed
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${client.negativeItemsTotal ? 
                              (client.negativeItemsRemoved || 0) / client.negativeItemsTotal * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(client.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/clients/${client.id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No clients found matching your criteria.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;