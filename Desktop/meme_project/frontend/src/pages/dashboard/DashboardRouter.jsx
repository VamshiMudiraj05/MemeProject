import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BrandDashboard from './BrandDashboard';
import InfluencerDashboard from './InfluencerDashboard';

function DashboardRouter() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.userType) {
    case 'brand':
      return <BrandDashboard />;
    case 'influencer':
      return <InfluencerDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default DashboardRouter;