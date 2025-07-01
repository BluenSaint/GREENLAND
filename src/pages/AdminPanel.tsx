import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Shield, 
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Server,
  FileText,
  Download,
  Upload
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'system', name: 'System Settings', icon: Settings },
    { id: 'compliance', name: 'Compliance', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Database },
  ];

  const systemStats = {
    totalUsers: 156,
    activeUsers: 142,
    totalClients: 67,
    systemUptime: '99.9%',
    diskUsage: 45,
    memoryUsage: 62,
    cpuUsage: 23
  };

  const recentActivity = [
    { id: 1, type: 'user_login', user: 'Sarah Johnson', action: 'Logged in', time: '5 minutes ago' },
    { id: 2, type: 'client_added', user: 'Michael Davis', action: 'Added new client: Jennifer Wilson', time: '12 minutes ago' },
    { id: 3, type: 'dispute_sent', user: 'Sarah Johnson', action: 'Sent dispute letter for John Smith', time: '23 minutes ago' },
    { id: 4, type: 'system_backup', user: 'System', action: 'Automatic backup completed', time: '1 hour ago' },
  ];

  const users = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@creditfix.com', role: 'Admin', status: 'Active', lastLogin: '5 minutes ago' },
    { id: 2, name: 'Michael Davis', email: 'michael@creditfix.com', role: 'Specialist', status: 'Active', lastLogin: '2 hours ago' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily@creditfix.com', role: 'Specialist', status: 'Inactive', lastLogin: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Manage users, system settings, and monitor platform performance.</p>
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* System Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-blue-600">{systemStats.totalUsers}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold text-green-600">{systemStats.activeUsers}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Clients</p>
                        <p className="text-2xl font-bold text-purple-600">{systemStats.totalClients}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">System Uptime</p>
                        <p className="text-2xl font-bold text-yellow-600">{systemStats.systemUptime}</p>
                      </div>
                      <Server className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                      <span className="text-sm text-gray-600">{systemStats.diskUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${systemStats.diskUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                      <span className="text-sm text-gray-600">{systemStats.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${systemStats.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                      <span className="text-sm text-gray-600">{systemStats.cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${systemStats.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === 'user_login' && <Users className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'client_added' && <UserPlus className="w-5 h-5 text-green-600" />}
                        {activity.type === 'dispute_sent' && <FileText className="w-5 h-5 text-purple-600" />}
                        {activity.type === 'system_backup' && <Database className="w-5 h-5 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Add User</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">General Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                      <input 
                        type="text" 
                        defaultValue="CreditFix Pro"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                      <input 
                        type="email" 
                        defaultValue="support@creditfix.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                      <input 
                        type="number" 
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Security Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Require 2FA for Admin</p>
                        <p className="text-sm text-gray-600">Force two-factor authentication for admin users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Login Attempt Limit</p>
                        <p className="text-sm text-gray-600">Lock account after failed attempts</p>
                      </div>
                      <input 
                        type="number" 
                        defaultValue="5"
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Compliance Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h4 className="font-medium text-gray-900">FCRA Compliance</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">All systems are compliant with Fair Credit Reporting Act requirements.</p>
                  <button className="text-sm text-green-600 hover:text-green-800">View Details</button>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h4 className="font-medium text-gray-900">CROA Compliance</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">All contracts and disclosures meet Credit Repair Organizations Act standards.</p>
                  <button className="text-sm text-green-600 hover:text-green-800">View Details</button>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Compliance Actions</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Generate Compliance Report</span>
                      <Download className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Update Contract Templates</span>
                      <FileText className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Review Disclosure Forms</span>
                      <Shield className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Management Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Database Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Records</span>
                      <span className="text-sm font-medium text-gray-900">12,456</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Backup</span>
                      <span className="text-sm font-medium text-gray-900">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database Size</span>
                      <span className="text-sm font-medium text-gray-900">2.3 GB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Backup & Recovery</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Create Backup</span>
                    </button>
                    <button className="w-full bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 flex items-center justify-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Restore Backup</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Data Export</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                    <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">Export Users</div>
                  </button>
                  <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                    <FileText className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">Export Reports</div>
                  </button>
                  <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                    <Database className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">Full Export</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
