import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@creditfix.com', password: 'admin123' },
    { role: 'Specialist', email: 'specialist@creditfix.com', password: 'specialist123' },
    { role: 'Client', email: 'john.smith@email.com', password: 'client123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <CreditCard className="w-10 h-10 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">CreditFix Pro</h1>
                </div>
                <p className="text-gray-600">Professional Credit Repair Platform</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</h3>
                <div className="space-y-2">
                  {demoCredentials.map((cred, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      <strong>{cred.role}:</strong> {cred.email} / {cred.password}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Brand/Image */}
            <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700">
              <div className="h-full flex flex-col justify-center items-center p-12 text-white">
                <img
                  src="/images/hero-team.jpg"
                  alt="Professional Team"
                  className="rounded-xl shadow-2xl mb-8 w-full max-w-sm"
                />
                <h2 className="text-3xl font-bold mb-4 text-center">
                  Trusted by Credit Professionals
                </h2>
                <p className="text-lg text-blue-100 text-center leading-relaxed">
                  Comprehensive credit repair platform with FCRA and CROA compliance, 
                  automated dispute management, and powerful analytics.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-blue-200 text-sm">Active Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-blue-200 text-sm">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80">
          <p className="text-sm">
            © 2025 CreditFix Pro. All rights reserved. | 
            <span className="ml-1">FCRA & CROA Compliant Platform</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
