import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Star, 
  ChevronRight,
  Play,
  FileText,
  Target,
  CreditCard,
  Shield,
  Search
} from 'lucide-react';
import { educationService, type EducationContent } from '../services/educationService';

const Education: React.FC = () => {
  const [educationContent, setEducationContent] = useState<EducationContent[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<EducationContent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEducationContent();
  }, []);

  const loadEducationContent = async () => {
    try {
      setLoading(true);
      const data = await educationService.getEducationContent();
      setEducationContent(data);
    } catch (error) {
      console.error('Failed to load education content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = educationContent.filter(content => {
    const matchesSearch = 
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(educationContent.map(content => content.category)))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'credit fundamentals':
        return <BookOpen className="w-6 h-6 text-blue-600" />;
      case 'credit improvement':
        return <TrendingUp className="w-6 h-6 text-green-600" />;
      case 'credit management':
        return <CreditCard className="w-6 h-6 text-purple-600" />;
      case 'debt management':
        return <Target className="w-6 h-6 text-orange-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Credit Education Center</h1>
        <p className="text-blue-100">
          Learn how to improve your credit score and maintain healthy credit habits with our comprehensive guides.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{educationContent.length}</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {educationContent.reduce((total, content) => {
                  const minutes = parseInt(content.readTime.split(' ')[0]);
                  return total + minutes;
                }, 0)}
              </div>
              <div className="text-sm text-gray-600">Min Reading</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">750+</div>
              <div className="text-sm text-gray-600">Target Score</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
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

      {/* Content Grid */}
      {!selectedArticle ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content) => (
            <div 
              key={content.id} 
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedArticle(content)}
            >
              <div className="flex items-start justify-between mb-4">
                {getCategoryIcon(content.category)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
                  {content.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{content.content.introduction.slice(0, 120)}...</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {content.readTime}
                  </span>
                  <span>{content.category}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Article View */
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center space-x-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Articles</span>
            </button>
            
            <div className="flex items-center space-x-4 mb-4">
              {getCategoryIcon(selectedArticle.category)}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedArticle.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedArticle.readTime}
                  </span>
                  <span>{selectedArticle.category}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedArticle.difficulty)}`}>
                    {selectedArticle.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Introduction */}
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {selectedArticle.content.introduction}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {selectedArticle.content.sections.map((section, index) => (
                <div key={index} className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Takeaways */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-blue-600 mr-2" />
                Key Takeaways
              </h3>
              <ul className="space-y-2">
                {selectedArticle.content.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips Section */}
      {!selectedArticle && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Credit Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Pay Bills on Time</h3>
                <p className="text-sm text-gray-600">Payment history accounts for 35% of your credit score. Set up automatic payments to never miss a due date.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Keep Utilization Low</h3>
                <p className="text-sm text-gray-600">Keep credit card balances below 30% of your limit. Lower utilization rates can boost your score quickly.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Monitor Your Credit</h3>
                <p className="text-sm text-gray-600">Check your credit reports regularly for errors and signs of identity theft. You're entitled to free reports annually.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Build Credit History</h3>
                <p className="text-sm text-gray-600">Keep old accounts open and use credit cards responsibly to build a longer credit history.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;