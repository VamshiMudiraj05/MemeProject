import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Instagram, Twitter, Youtube, Users, ArrowRight, AlertCircle, Frown } from 'lucide-react';
import { getAllInfluencers } from '../../services/api';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import MessageModal from '../../components/messaging/MessageModal';

function InfluencerListPage() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchInfluencers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllInfluencers();
      setInfluencers(data);
    } catch (err) {
      console.error('Error fetching influencers:', err);
      setError(err.message || 'Failed to load influencers');
      
      // If unauthorized, log the user out
      if (err.message.includes('authentication') || err.message.includes('token')) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  const filteredInfluencers = influencers.filter(influencer =>
    influencer.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (influencer.niche && influencer.niche.toLowerCase().includes(searchTerm.toLowerCase())) ||
    influencer.accountType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (id) => {
    navigate(`/dashboard/influencers/${id}`);
  };

  const handleMessageInfluencer = (influencer) => {
    setSelectedInfluencer(influencer);
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setSelectedInfluencer(null);
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      <p className="text-gray-300">Loading influencers...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
      <div className="flex flex-col items-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-300">Something went wrong</h3>
        <p className="mt-2 text-red-200">{error}</p>
        <button
          onClick={fetchInfluencers}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          disabled={loading}
        >
          {loading ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
      <div className="flex flex-col items-center">
        <Frown className="h-12 w-12 text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-300">No influencers found</h3>
        <p className="mt-2 text-gray-400">
          {searchTerm ? 'Try adjusting your search' : 'Check back later for new influencers'}
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );

  if (loading && influencers.length === 0) {
    return <Layout>{renderLoadingState()}</Layout>;
  }

  if (error) {
    return <Layout>{renderErrorState()}</Layout>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold text-white">All Influencers</h1>
            <p className="mt-2 text-gray-300">Browse through registered influencers</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Influencer Directory</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search influencers..."
                    className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

            {filteredInfluencers.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInfluencers.map((influencer) => (
                   <div key={influencer._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                   <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center">
                       {influencer.profilePic ? (
                         <img src={influencer.profilePic} alt={influencer.alias} className="h-8 w-8 rounded-full object-cover" />
                       ) : (
                         <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-lg text-white font-bold">
                           {influencer.alias?.charAt(0) || 'I'}
                         </div>
                       )}
                       <span className="ml-2 text-white font-semibold">@{influencer.instagramHandle || influencer.alias}</span>
                     </div>
                     <span className="text-purple-400 text-sm">Followers: {influencer.followers?.toLocaleString()}</span>
                   </div>
                   <p className="text-gray-300 text-sm mb-2">Account Type: {influencer.accountType}</p>
                   <div className="flex justify-between items-center">
                     <span className="text-gray-400 text-sm">Engagement: {influencer.engagement}%</span>
                   </div>
                   {/* Display pricing details if available */}
                    {influencer.pricing ? (
                      <div className="mt-3 text-gray-400 text-sm space-y-1">
                        <p>Story Price: ₹{influencer.pricing.storyPrice}</p>
                        <p>Post Price: ₹{influencer.pricing.postPrice}</p>
                        <p>Reel Price: ₹{influencer.pricing.reelPrice}</p>
                        <p>Negotiable: {influencer.pricing.negotiable ? 'Yes' : 'No'}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm mt-3">Pricing not specified</p>
                    )}

                  {influencer.sampleUrl && (
                    <a 
                      href={influencer.sampleUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                    >
                      View Sample Post <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  )}

                   <div className="mt-4 flex gap-2">
                     <button 
                       onClick={() => handleViewProfile(influencer._id)}
                       className="flex-1 flex items-center justify-center bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
                     >
                       View Profile <ArrowRight className="ml-2 h-4 w-4" />
                     </button>
                     <button 
                       onClick={() => handleMessageInfluencer(influencer)}
                       className="flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                       title="Message this influencer"
                     >
                       <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                       </svg>
                     </button>
                   </div>
                 </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {selectedInfluencer && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={handleCloseMessageModal}
          recipient={selectedInfluencer}
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

export default InfluencerListPage; 