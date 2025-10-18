import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Users, TrendingUp, Sparkles, Target } from 'lucide-react';

function BrandDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewInfluencersClick = () => {
    navigate('/dashboard/influencers');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        {/* Hero Section with Gradient Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-orange-900/20">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, {user?.fullName || 'Brand'}!
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Ready to grow your brand? Create promotions, find influencers, and manage applications all in one place.
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => navigate('/dashboard/brand-profile/edit')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/dashboard/create-promotion')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Promotion
              </button>
              <button
                onClick={() => navigate('/dashboard/promotions')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-lg font-medium hover:from-red-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Users className="h-5 w-5 mr-2" />
                View Applications
              </button>
              <button
                onClick={handleViewInfluencersClick}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg font-medium hover:from-teal-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Find Influencers
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Create Promotions */}
            <div className="group relative bg-gray-800 rounded-2xl p-8 hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-6">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Create Promotions</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Design compelling campaigns that attract the perfect influencers for your brand. Set budgets, choose platforms, and reach your target audience.
                </p>
                <button 
                  onClick={() => navigate('/dashboard/create-promotion')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-500 hover:to-purple-600 transition-all transform hover:scale-105"
                >
                  Start Creating
                </button>
              </div>
            </div>

            {/* Manage Applications */}
            <div className="group relative bg-gray-800 rounded-2xl p-8 hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mb-6">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Manage Applications</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Review influencer applications, check their profiles, and make informed decisions. Accept or reject applications with just one click.
                </p>
                <button 
                  onClick={() => navigate('/dashboard/promotions')}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:from-red-500 hover:to-orange-600 transition-all transform hover:scale-105"
                >
                  View Applications
                </button>
              </div>
            </div>

            {/* Find Influencers */}
            <div className="group relative bg-gray-800 rounded-2xl p-8 hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mb-6">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Find Influencers</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Discover influencers that match your brand's values and target audience. Filter by followers, engagement, and content type.
                </p>
                <button 
                  onClick={handleViewInfluencersClick}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:from-teal-500 hover:to-green-600 transition-all transform hover:scale-105"
                >
                  Browse Influencers
                </button>
              </div>
            </div>

            {/* Messaging */}
            <div className="group relative bg-gray-800 rounded-2xl p-8 hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl mb-6">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Direct Messaging</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Communicate directly with influencers to discuss collaborations, negotiate terms, and build lasting partnerships.
                </p>
                <button 
                  onClick={() => navigate('/dashboard/messages')}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-500 hover:to-pink-600 transition-all transform hover:scale-105"
                >
                  Open Messages
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Ready to grow your brand?</h2>
            <p className="text-gray-300 max-w-md mx-auto mb-8">
              Start by creating your first promotion or explore our influencer network to find the perfect match for your brand.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard/create-promotion')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Promotion
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BrandDashboard;