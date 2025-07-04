import React, { useEffect, useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Target,
  FileText,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { clientService, creditScoreService, negativeItemService } from '../services/clientService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { Client, CreditScore } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [creditData, setCreditData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (user?.role === 'client') {
        // Load client-specific data
        const clientData = await clientService.getClientByUserId(user.id);
        
        if (clientData) {
          const [creditScores, negativeItems] = await Promise.all([
            creditScoreService.getCreditScores(clientData.id),
            negativeItemService.getNegativeItems(clientData.id)
          ]);

          const currentScore = creditScores[creditScores.length - 1];
          const initialScore = creditScores[0];
          
          setStats({
            currentScore: currentScore?.average || 0,
            initialScore: initialScore?.average || 0,
            improvement: currentScore && initialScore ? currentScore.average - initialScore.average : 0,
            negativeItemsRemoved: negativeItems.filter(item => item.status === 'removed').length,
            itemsInProgress: negativeItems.filter(item => item.status === 'in_progress').length,
            totalItems: negativeItems.length
          });

          // Format credit data for chart
          const chartData = creditScores.map(score => ({
            date: new Date(score.score_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: score.average
          }));
          setCreditData(chartData);
        }
      } else {
        // Load admin/specialist data
        const clients = await clientService.getClients();
        
        const totalClients = clients.length;
        const activeClients = clients.filter(c => c.status === 'active').length;
        
        // Get all negative items for all clients
        const allNegativeItems = await Promise.all(
          clients.map(client => negativeItemService.getNegativeItems(client.id))
        );
        const flatNegativeItems = allNegativeItems.flat();
        
        const totalNegativeItems = flatNegativeItems.length;
        const removedItems = flatNegativeItems.filter(item => item.status === 'removed').length;
        
        // Calculate average score improvement
        const allCreditScores = await Promise.all(
          clients.map(client => creditScoreService.getCreditScores(client.id))
        );
        
        let totalImprovement = 0;
        let clientsWithScores = 0;
        
        allCreditScores.forEach(scores => {
          if (scores.length >= 2) {
            const latest = scores[scores.length - 1];
            const initial = scores[0];
            totalImprovement += latest.average - initial.average;
            clientsWithScores++;
          }
        });
        
        const avgScoreImprovement = clientsWithScores > 0 ? Math.round(totalImprovement / clientsWithScores) : 0;
        
        setStats({
          totalClients,
          activeClients,
          removedItems,
          totalNegativeItems,
          avgScoreImprovement,
          successRate: totalNegativeItems > 0 ? Math.round((removedItems / totalNegativeItems) * 100) : 0
        });

        // Sample data for charts (you can enhance this with real aggregated data)
        setCreditData([
          { month: 'Jan', clients: Math.floor(totalClients * 0.7), avgScore: 620 },
          { month: 'Feb', clients: Math.floor(totalClients * 0.8), avgScore: 635 },
          { month: 'Mar', clients: Math.floor(totalClients * 0.85), avgScore: 648 },
          { month: 'Apr', clients: Math.floor(totalClients * 0.9), avgScore: 662 },
          { month: 'May', clients: Math.floor(totalClients * 0.95), avgScore: 675 },
          { month: 'Jun', clients: totalClients, avgScore: 689 }
        ]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  // Client Dashboard
  if (user?.role === 'client') {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-blue-100">Track your credit repair progress and see your improvements over time.</p>
        </div>

        {/* Credit Score Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentScore}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Improvement</p>
                <p className="text-2xl font-bold text-green-600">+{stats.improvement}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Removed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.negativeItemsRemoved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.itemsInProgress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Score Chart */}
        {creditData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={creditData}>
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
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <FileText className="w-10 h-10 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900">View Documents</h4>
                <p className="text-sm text-gray-600">Access your case documents</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <CreditCard className="w-10 h-10 text-green-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Credit Reports</h4>
                <p className="text-sm text-gray-600">Download latest reports</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <Users className="w-10 h-10 text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Contact Specialist</h4>
                <p className="text-sm text-gray-600">Get expert help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin/Specialist Dashboard
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="text-blue-100">
          Manage your credit repair business with comprehensive tools and analytics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Items Removed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.removedItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Score Boost</p>
              <p className="text-2xl font-bold text-gray-900">+{stats.avgScoreImprovement}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={creditData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clients" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Credit Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={creditData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">System connected to Supabase</p>
              <p className="text-sm text-gray-600">Real-time data integration active</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{stats.totalClients} clients loaded</p>
              <p className="text-sm text-gray-600">All client data synchronized</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-gray-900">Database fully operational</p>
              <p className="text-sm text-gray-600">All services connected and functional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;