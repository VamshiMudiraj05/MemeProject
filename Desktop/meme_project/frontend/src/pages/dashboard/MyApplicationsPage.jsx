import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { getInfluencerApplications } from '../../services/api';
import { format } from 'date-fns';

function MyApplicationsPage() {
  const { user: _user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getInfluencerApplications();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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
            <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
            <p className="text-gray-400">Track the status of your promotion applications</p>
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
              <p className="text-gray-500">Start applying for promotions to see them here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left side - Promotion details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {application.promotion.title}
                          </h3>
                          <p className="text-gray-300 text-sm line-clamp-2">
                            {application.promotion.description}
                          </p>
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </div>
                      </div>

                      {/* Promotion details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>Budget: ₹{application.promotion.budget}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {formatDate(application.promotion.startDate)} - {formatDate(application.promotion.endDate)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Applied: {formatDate(application.createdAt)}
                        </div>
                      </div>

                      {/* Application details */}
                      {application.message && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-300 mb-1">Your Message:</h4>
                          <p className="text-sm text-gray-400 bg-gray-700/50 p-3 rounded">
                            {application.message}
                          </p>
                        </div>
                      )}

                      {/* Proposed details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {application.proposedPrice && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Your Proposed Price:</h4>
                            <p className="text-sm text-orange-400">₹{application.proposedPrice}</p>
                          </div>
                        )}
                        {application.proposedContent && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Your Content Ideas:</h4>
                            <p className="text-sm text-gray-400 bg-gray-700/50 p-2 rounded">
                              {application.proposedContent}
                            </p>
                          </div>
                        )}
                      </div>
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

export default MyApplicationsPage; 