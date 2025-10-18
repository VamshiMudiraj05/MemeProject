import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SignIn from './pages/SignIn';
import GetStarted from './pages/GetStarted';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Trending from './pages/Trending';
import InfluencerListPage from './pages/dashboard/InfluencerListPage';
import InfluencerDetailPage from './pages/dashboard/InfluencerDetailPage';
import DashboardRouter from './pages/dashboard/DashboardRouter';
import CreatePromotionPage from './pages/dashboard/CreatePromotionPage';
import EditProfile from './pages/dashboard/EditProfile';
import MyApplicationsPage from './pages/dashboard/MyApplicationsPage';
import PromotionApplicationsPage from './pages/dashboard/PromotionApplicationsPage';
import BrandPromotionsPage from './pages/dashboard/BrandPromotionsPage';
import ConversationsPage from './pages/messaging/ConversationsPage';
import ConversationDetailPage from './pages/messaging/ConversationDetailPage';
import BrandEditProfile from './pages/dashboard/BrandEditProfile';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Layout><SignIn /></Layout>} />
        <Route path="/register" element={<Layout><GetStarted /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/trending" element={<Layout><Trending /></Layout>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<DashboardRouter />} />
          <Route path="influencers">
            <Route index element={<InfluencerListPage />} />
            <Route path=":id" element={<InfluencerDetailPage />} />
          </Route>
          <Route path="create-promotion" element={<CreatePromotionPage />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="brand-profile/edit" element={<BrandEditProfile />} />
          <Route path="applications" element={<MyApplicationsPage />} />
          <Route path="promotions/:promotionId/applications" element={<PromotionApplicationsPage />} />
          <Route path="promotions" element={<BrandPromotionsPage />} />
          <Route path="messages" element={<ConversationsPage />} />
          <Route path="messages/:conversationId" element={<ConversationDetailPage />} />
        </Route>

        {/* Landing Page - This route seems to conflict with ProtectedRoute for '/', will keep for now but might need adjustment */}
        <Route path="/" element={<Layout><LandingPage /></Layout>} />

      </Routes>
    </AuthProvider>
  );
}

export default App;
