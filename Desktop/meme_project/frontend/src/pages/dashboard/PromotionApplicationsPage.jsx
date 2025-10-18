import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, DollarSign, Users, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { getApplicationsForPromotion, updateApplicationStatus } from '../../services/api';
import { format } from 'date-fns';

function PromotionApplicationsPage() {
  const { promotionId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getApplicationsForPromotion(promotionId);
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (promotionId) {
      fetchApplications();
    }
  }, [promotionId]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(applicationId);
      await updateApplicationStatus(applicationId, newStatus);
      
      // Update the local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-500';
      case 'accepted':
        return 'bg-green-900/30 text-green-400 border-green-500';
      case 'rejected':
        return 'bg-red-900/30 text-red-400 border-red-500';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading applications...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
                <p className="text-gray-400">
                  {applications.length} application{applications.length !== 1 ? 's' : ''} received
                </p>
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="h-5 w-5 mr-2" />
                <span>{applications.length} applicants</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No applications yet</h3>
              <p className="text-gray-500">Applications will appear here once influencers apply</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left side - Influencer details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            @{application.influencer.alias || application.influencer.instagramHandle}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {application.influencer.accountType} • {application.influencer.followers?.toLocaleString()} followers
                          </p>
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </div>
                      </div>

                      {/* Influencer stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{application.influencer.followers?.toLocaleString()} followers</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>{application.influencer.engagement}% engagement</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Applied: {formatDate(application.createdAt)}
                        </div>
                      </div>

                      {/* Pricing info */}
                      {application.influencer.pricing && (
                        <div className="mb-4 p-4 bg-gray-700/50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Pricing:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div className="text-gray-400">
                              Story: ₹{application.influencer.pricing.storyPrice}
                            </div>
                            <div className="text-gray-400">
                              Post: ₹{application.influencer.pricing.postPrice}
                            </div>
                            <div className="text-gray-400">
                              Reel: ₹{application.influencer.pricing.reelPrice}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Application details */}
                      {application.message && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Message:</h4>
                          <p className="text-sm text-gray-400 bg-gray-700/50 p-3 rounded">
                            {application.message}
                          </p>
                        </div>
                      )}

                      {/* Proposed details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {application.proposedPrice && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Proposed Price:</h4>
                            <p className="text-sm text-orange-400">₹{application.proposedPrice}</p>
                          </div>
                        )}
                        {application.proposedContent && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Content Ideas:</h4>
                            <p className="text-sm text-gray-400 bg-gray-700/50 p-2 rounded">
                              {application.proposedContent}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(application._id, 'accepted')}
                            disabled={updatingStatus === application._id}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingStatus === application._id ? 'Updating...' : 'Accept'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                            disabled={updatingStatus === application._id}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingStatus === application._id ? 'Updating...' : 'Reject'}
                          </button>
                        </>
                      )}
                      {application.status !== 'pending' && (
                        <div className="text-center text-sm text-gray-400">
                          {application.status === 'accepted' ? 'Application accepted' : 'Application rejected'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default PromotionApplicationsPage; 