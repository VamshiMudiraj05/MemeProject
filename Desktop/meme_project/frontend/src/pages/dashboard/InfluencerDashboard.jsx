import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Instagram, Users, TrendingUp, DollarSign, Calendar, ArrowRight, Briefcase, Clock, Globe, Sparkles, Target, Award } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { getPromotions } from '../../services/api';
import { format } from 'date-fns';
import ApplicationModal from '../../components/common/ApplicationModal';
import MessageModal from '../../components/messaging/MessageModal';

function InfluencerDashboard() {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const data = await getPromotions();
        setPromotions(data);
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError('Failed to load promotions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleApplyNow = (promotion) => {
    setSelectedPromotion(promotion);
    setIsApplicationModalOpen(true);
  };

  const handleCloseApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setSelectedPromotion(null);
  };

  const handleMessageBrand = (promotion) => {
    setSelectedBrand(promotion.brand);
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setSelectedBrand(null);
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'youtube':
        return <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>;
      case 'twitter':
        return <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>;
      default:
        return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        {/* Hero Section with Gradient Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, {user?.alias || 'Influencer'}!
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Ready to grow your influence? Discover amazing brand opportunities and apply for promotions that match your style.
              </p>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-gray-700/50 transition-all transform hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl mb-3">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{user?.followers || '0'}</p>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-gray-700/50 transition-all transform hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{user?.engagement || '0%'}</p>
                <p className="text-sm text-gray-400">Engagement</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-gray-700/50 transition-all transform hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">$0</p>
                <p className="text-sm text-gray-400">Earnings</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-gray-700/50 transition-all transform hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-gray-400">Campaigns</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => window.location.href = '/dashboard/profile/edit'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Target className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/applications'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-lg font-medium hover:from-red-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Award className="h-5 w-5 mr-2" />
                My Applications
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Promotions Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Available Promotions</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover amazing brand opportunities that match your style and audience. Apply for promotions that align with your values.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-400">Loading promotions...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-md">
                {error}
              </div>
            ) : Array.isArray(promotions) && promotions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {promotions.map((promotion) => (
                  <div 
                    key={promotion._id} 
                    className="group relative bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative p-8 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{promotion.title}</h3>
                          <p className="text-gray-300 text-sm line-clamp-3">
                            {promotion.description}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                          ₹{promotion.budget}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {promotion.platforms?.map((platform, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
                          >
                            {getPlatformIcon(platform)}
                            <span className="ml-1">{platform}</span>
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-700">
                        <div className="flex items-center text-sm text-gray-400 mb-4">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApplyNow(promotion)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-xl font-medium hover:from-red-500 hover:to-orange-600 transition-all transform hover:scale-105"
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Apply Now
                          </button>
                          <button 
                            onClick={() => handleMessageBrand(promotion)}
                            className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800/50 rounded-2xl">
                <Briefcase className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No promotions available</h3>
                <p className="text-gray-500 max-w-md mx-auto">Check back later for new opportunities that match your style and audience.</p>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-6">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Ready to grow your influence?</h2>
            <p className="text-gray-300 max-w-md mx-auto mb-8">
              Keep your profile updated and check back regularly for new brand opportunities that match your style.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.location.href = '/dashboard/profile/edit'}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Target className="h-5 w-5 mr-2" />
                Update Your Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedPromotion && (
        <ApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={handleCloseApplicationModal}
          promotion={selectedPromotion}
        />
      )}

      {/* Message Modal */}
      {selectedBrand && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={handleCloseMessageModal}
          recipient={selectedBrand}
          recipientType="Brand"
          onMessageSent={() => {
            handleCloseMessageModal();
            // Optionally refresh data or show success message
          }}
        />
      )}
    </Layout>
  );
}

export default InfluencerDashboard;