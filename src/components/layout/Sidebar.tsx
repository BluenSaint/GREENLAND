import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Shield,
  CreditCard,
  User
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'specialist', 'client'] },
  { name: 'Client Management', href: '/clients', icon: Users, roles: ['admin', 'specialist'] },
  { name: 'Dispute Management', href: '/disputes', icon: AlertTriangle, roles: ['admin', 'specialist'] },
  { name: 'Reports & Analytics', href: '/reports', icon: BarChart3, roles: ['admin', 'specialist'] },
  { name: 'Client Portal', href: '/portal', icon: User, roles: ['client'] },
  { name: 'Documents', href: '/documents', icon: FileText, roles: ['admin', 'specialist', 'client'] },
  { name: 'Credit Education', href: '/education', icon: BookOpen, roles: ['admin', 'specialist', 'client'] },
  { name: 'Admin Panel', href: '/admin', icon: Shield, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'specialist', 'client'] },
];

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const filteredNavigation = navigation.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      {/* Logo */}
      <div className="flex items-center space-x-2 px-4">
        <CreditCard className="w-8 h-8 text-blue-200" />
        <div>
          <h1 className="text-xl font-bold">CreditFix Pro</h1>
          <p className="text-xs text-blue-200">Credit Repair Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-blue-800 bg-opacity-50 rounded-lg p-3">
          <p className="text-xs text-blue-200 mb-1">Need Help?</p>
          <p className="text-xs text-blue-100">Contact Support</p>
          <p className="text-xs text-blue-200">support@creditfix.com</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
