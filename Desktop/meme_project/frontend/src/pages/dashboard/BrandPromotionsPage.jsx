import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Calendar, DollarSign, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { getBrandPromotions } from '../../services/api';
import { format } from 'date-fns';

function BrandPromotionsPage() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const data = await getBrandPromotions();
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

  const getStatusColor = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'bg-blue-900/30 text-blue-400 border-blue-500';
    if (now > end) return 'bg-gray-900/30 text-gray-400 border-gray-500';
    return 'bg-green-900/30 text-green-400 border-green-500';
  };

  const getStatusText = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'Upcoming';
    if (now > end) return 'Ended';
    return 'Active';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading promotions...</p>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Promotions</h1>
              <p className="text-gray-400">Manage your campaigns and view applications</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/create-promotion')}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Promotion
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Promotions List */}
          {promotions.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No promotions yet</h3>
              <p className="text-gray-500 mb-4">Create your first promotion to start attracting influencers</p>
              <button
                onClick={() => navigate('/dashboard/create-promotion')}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Promotion
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promotion) => (
                <div
                  key={promotion._id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:translate-y-[-2px]"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{promotion.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                          {promotion.description}
                        </p>
                      </div>
                      <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(promotion.startDate, promotion.endDate)}`}>
                        {getStatusText(promotion.startDate, promotion.endDate)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {promotion.platforms?.map((platform, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-400">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>₹{promotion.budget}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(promotion.startDate)}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-700">
                      <button
                        onClick={() => navigate(`/dashboard/promotions/${promotion._id}/applications`)}
                        className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Applications
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
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

export default BrandPromotionsPage; 