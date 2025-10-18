import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Instagram, Youtube, Twitter, ArrowLeft, AlertCircle, Frown, Loader2, Image as ImageIcon } from 'lucide-react';
import { getInfluencerById } from '../../services/api';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import MessageModal from '../../components/messaging/MessageModal';

function InfluencerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const { logout } = useAuth();

  const fetchInfluencer = useCallback(async () => {
    if (!id) {
      setError('No influencer ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getInfluencerById(id);
      setInfluencer(data);
    } catch (err) {
      console.error('Error fetching influencer:', err);
      setError(err.message || 'Failed to load influencer details');
      if (err.message.includes('authentication') || err.message.includes('token')) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [id, logout, navigate]);

  const handleMessageInfluencer = () => {
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
  };

  useEffect(() => {
    fetchInfluencer();
  }, [fetchInfluencer]);

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      <p className="text-gray-300">Loading influencer details...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center max-w-2xl mx-auto mt-8">
      <div className="flex flex-col items-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-300">Failed to load influencer</h3>
        <p className="mt-2 text-red-200">{error}</p>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={fetchInfluencer}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Try Again'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotFoundState = () => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center max-w-2xl mx-auto mt-8">
      <div className="flex flex-col items-center">
        <Frown className="h-12 w-12 text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-gray-300">Influencer Not Found</h3>
        <p className="mt-2 text-gray-400">The requested influencer could not be found or may have been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
        >
          Back to Influencers
        </button>
      </div>
    </div>
  );

  if (loading) return <Layout>{renderLoadingState()}</Layout>;
  if (error) return <Layout>{renderErrorState()}</Layout>;
  if (!influencer) return <Layout>{renderNotFoundState()}</Layout>;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Influencers</span>
          </button>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
            {/* Banner */}
            <div className="h-40 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500">
              <div className="h-full w-full bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            <div className="px-4 lg:px-6 pb-6 -mt-4">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="relative">
                  <div className="h-24 w-24 rounded-xl border-4 border-gray-800 bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-3xl text-white font-bold shadow-lg -mt-12">
                    {influencer.alias?.charAt(0) || 'I'}
                  </div>
                  {influencer.platform && (
                    <div className="absolute -bottom-2 -right-2 bg-gray-900 p-1.5 rounded-full border-2 border-gray-800">
                      {getPlatformIcon(influencer.platform)}
                    </div>
                  )}
                </div>
                
                <div className="mt-3 md:mt-0 md:ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-white">
                        @{influencer.instagramHandle || influencer.alias}
                      </h1>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                          {influencer.accountType || 'Influencer'}
                        </span>
                        <span className="ml-2 text-sm text-gray-400">
                          {influencer.followers?.toLocaleString()} followers
                        </span>
                      </div>
                    </div>
                    
                    {influencer.sampleUrl && (
                      <a 
                        href={influencer.sampleUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 transition-colors duration-200"
                      >
                        View Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content - Reorganized */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* About Section */}
                  {influencer.bio && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <div className="h-1 w-6 bg-orange-500 rounded-full mr-2"></div>
                        <h2 className="text-base font-bold text-white">About</h2>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-sm">{influencer.bio}</p>
                    </div>
                  )}

                  {/* Account Details */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <div className="h-1 w-6 bg-orange-500 rounded-full mr-2"></div>
                      <h2 className="text-base font-bold text-white">Account Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-1">Platform</p>
                        <p className="text-sm text-white font-medium capitalize">{influencer.platform || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-1">Niche</p>
                        <p className="text-sm text-white font-medium">{influencer.niche || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-1">Account Type</p>
                        <p className="text-sm text-white font-medium">{influencer.accountType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-1">Engagement Rate</p>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(100, influencer.engagement || 0)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-white">{influencer.engagement || '0'}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification */}
                  {influencer.verificationScreenshot && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <div className="h-1 w-6 bg-orange-500 rounded-full mr-2"></div>
                        <h2 className="text-base font-bold text-white">Verification</h2>
                        <span className="ml-auto text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      </div>
                      <div className="relative group rounded-lg overflow-hidden border border-gray-700">
                        <img 
                          src={influencer.verificationScreenshot.url} 
                          alt={`${influencer.alias || 'Influencer'} verification`}
                          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-3 transition-opacity">
                          <button 
                            onClick={() => window.open(influencer.verificationScreenshot.url, '_blank')}
                            className="px-3 py-1.5 bg-white/90 text-gray-900 text-xs font-medium rounded-full flex items-center hover:bg-white transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Full Size
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Promotions & Pricing */}
                <div className="space-y-6">
                  {/* Available Promotions */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <div className="h-1 w-6 bg-orange-500 rounded-full mr-2"></div>
                      <h2 className="text-base font-bold text-white">Available Promotions</h2>
                    </div>
                    {influencer.samplePosts?.length > 0 ? (
                      <div className="space-y-3">
                        {influencer.samplePosts.map((post, index) => (
                          post.url && (
                            <a 
                              key={index} 
                              href={post.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-orange-500/50 hover:bg-gray-700/30 transition-all duration-200 group"
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 mr-3 text-orange-500 bg-orange-500/10 p-1.5 rounded-lg">
                                  <ImageIcon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">
                                    {post.type?.startsWith('image/') ? 'Image Post' : 'View Post'} #{index + 1}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate mt-0.5">
                                    {post.url}
                                  </p>
                                </div>
                                <div className="ml-2 flex-shrink-0 text-gray-400 group-hover:text-orange-400 transition-colors">
                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </a>
                          )
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No sample posts available</p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <div className="h-1 w-6 bg-orange-500 rounded-full mr-2"></div>
                      <h2 className="text-base font-bold text-white">Pricing</h2>
                    </div>
                    {influencer.pricing ? (
                      <div className="space-y-3">
                        <div className="pb-3 border-b border-gray-700/50">
                          <p className="text-xs font-medium text-gray-400 mb-1">Story Post</p>
                          <p className="text-sm text-white font-medium">₹{influencer.pricing.storyPrice}</p>
                        </div>
                        <div className="pb-3 border-b border-gray-700/50">
                          <p className="text-xs font-medium text-gray-400 mb-1">Feed Post</p>
                          <p className="text-sm text-white font-medium">₹{influencer.pricing.postPrice}</p>
                        </div>
                        <div className="pb-3 border-b border-gray-700/50">
                          <p className="text-xs font-medium text-gray-400 mb-1">Reel</p>
                          <p className="text-sm text-white font-medium">₹{influencer.pricing.reelPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-1">Negotiable</p>
                          <p className="text-sm text-white font-medium">
                            {influencer.pricing.negotiable ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No pricing information available</p>
                    )}
                  </div>

                  {/* Contact Button */}
                  <button 
                    onClick={handleMessageInfluencer}
                    className="w-full bg-orange-600 text-white py-2.5 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message {influencer.alias}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {influencer && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={handleCloseMessageModal}
          recipient={influencer}
          recipientType="Influencer"
          onMessageSent={() => {
            handleCloseMessageModal();
            // Optionally show success message or refresh data
          }}
        />
      )}
    </Layout>
  );
}

export default InfluencerDetailPage;