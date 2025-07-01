import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users,
  Target,
  CheckCircle,
  DollarSign,
  Filter
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('last_30_days');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Sample data for charts
  const clientGrowthData = [
    { month: 'Jan', clients: 45, revenue: 4500 },
    { month: 'Feb', clients: 52, revenue: 5200 },
    { month: 'Mar', clients: 48, revenue: 4800 },
    { month: 'Apr', clients: 61, revenue: 6100 },
    { month: 'May', clients: 55, revenue: 5500 },
    { month: 'Jun', clients: 67, revenue: 6700 }
  ];

  const scoreImprovementData = [
    { range: '0-50 points', clients: 15, color: '#ef4444' },
    { range: '51-100 points', clients: 28, color: '#f59e0b' },
    { range: '101-150 points', clients: 32, color: '#10b981' },
    { range: '150+ points', clients: 18, color: '#3b82f6' }
  ];

  const disputeStatusData = [
    { status: 'Completed', count: 156, color: '#10b981' },
    { status: 'In Progress', count: 43, color: '#f59e0b' },
    { status: 'Pending', count: 21, color: '#3b82f6' },
    { status: 'Rejected', count: 8, color: '#ef4444' }
  ];

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 15750, expenses: 8500 },
    { month: 'Feb', revenue: 18200, expenses: 9200 },
    { month: 'Mar', revenue: 16800, expenses: 8800 },
    { month: 'Apr', revenue: 21350, expenses: 10500 },
    { month: 'May', revenue: 19250, expenses: 9800 },
    { month: 'Jun', revenue: 23450, expenses: 11200 }
  ];

  const generateReport = () => {
    setLoading(true);
    // Simulate report generation
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const exportReport = (format: string) => {
    // Simulate export functionality
    console.log(`Exporting report in ${format} format`);
  };

  const getKPIStats = () => {
    return {
      totalClients: 67,
      activeClients: 55,
      avgScoreImprovement: 85,
      successRate: 92,
      monthlyRevenue: 23450,
      itemsRemoved: 156,
      avgCaseLength: 4.2,
      customerSatisfaction: 4.8
    };
  };

  const stats = getKPIStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
            <option value="last_year">Last Year</option>
          </select>
          <button 
            onClick={generateReport}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <BarChart3 className="w-5 h-5" />
            <span>{loading ? 'Generating...' : 'Generate Report'}</span>
          </button>
          <button 
            onClick={() => exportReport('pdf')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Score Improvement</p>
              <p className="text-2xl font-bold text-gray-900">+{stats.avgScoreImprovement}</p>
              <p className="text-sm text-green-600">+8 points vs last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
              <p className="text-sm text-green-600">+3% from last month</p>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+18% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'clients', name: 'Client Analytics', icon: Users },
              { id: 'financial', name: 'Financial Reports', icon: DollarSign },
              { id: 'performance', name: 'Performance', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setReportType(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    reportType === tab.id
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
          {reportType === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Growth Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={clientGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="clients" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispute Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={disputeStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={({ status, count }) => `${status}: ${count}`}
                      >
                        {disputeStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Client Analytics Tab */}
          {reportType === 'clients' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Improvement Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreImprovementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clients" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.avgCaseLength}</div>
                  <div className="text-sm text-gray-600">Avg Case Length (months)</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.itemsRemoved}</div>
                  <div className="text-sm text-gray-600">Total Items Removed</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.customerSatisfaction}</div>
                  <div className="text-sm text-gray-600">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Reports Tab */}
          {reportType === 'financial' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">$11,200</div>
                  <div className="text-sm text-gray-600">Monthly Expenses</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">$12,250</div>
                  <div className="text-sm text-gray-600">Net Profit</div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {reportType === 'performance' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Disputes Completed</span>
                      <span className="text-sm text-gray-600">156 / 180 (87%)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Client Retention Rate</span>
                      <span className="text-sm text-gray-600">94%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Avg Response Time</span>
                      <span className="text-sm text-gray-600">32 days</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Success Rate</span>
                      <span className="text-sm text-gray-600">92%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                        <div className="text-xs text-gray-600">Senior Specialist</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">28 clients</div>
                        <div className="text-xs text-green-600">95% success rate</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Michael Davis</div>
                        <div className="text-xs text-gray-600">Credit Specialist</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">24 clients</div>
                        <div className="text-xs text-green-600">89% success rate</div>
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

export default Reports;
