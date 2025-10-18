import React from 'react';
import { Laugh, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-purple-500 bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900 backdrop-blur-lg shadow-lg shadow-blue-600/30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section with more playful elements */}
        <div className="flex items-center gap-2 group">
          <div className="relative">
            <Laugh className="h-7 w-7 text-yellow-400 animate-bounce hover:animate-spin transition-transform duration-500" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-ping" />
          </div>
          <a
            href="/"
            className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-400 hover:bg-gradient-to-l transition-all duration-500 hover:scale-105 transform"
          >
            MemEconomy
            <span className="text-xs align-top bg-blue-500 text-white px-1 py-0.5 rounded-full ml-1">LOL</span>
          </a>
        </div>

        {/* Center Links with hover effects - Only show when not authenticated */}
        {!isAuthenticated && (
          <div className="flex-grow hidden md:flex justify-center gap-8">
            <a
              href="/"
              className="relative text-gray-200 hover:text-white transition-colors duration-300 group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="/about"
              className="relative text-gray-200 hover:text-white transition-colors duration-300 group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="/trending"
              className="relative text-gray-200 hover:text-white transition-colors duration-300 group"
            >
              Trending
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="/contact"
              className="relative text-gray-200 hover:text-white transition-colors duration-300 group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
        )}

        {/* Dashboard Type - Only show when authenticated */}
        {isAuthenticated && (
          <div className="flex-grow hidden md:flex justify-center gap-8">
            <Link to="/dashboard" className="text-xl font-bold text-white hover:text-gray-300 transition-colors duration-300">
              {user?.userType === 'brand' ? 'Brand Dashboard' : 'Influencer Dashboard'}
            </Link>
            <Link to="/dashboard/messages" className="text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Messages
            </Link>
          </div>
        )}

        {/* Right Buttons with more personality */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <a
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full hover:from-yellow-500 hover:to-pink-500 transition-all duration-500 shadow-lg hover:shadow-pink-500/40 font-bold transform hover:scale-105"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="px-4 py-2 bg-transparent border-2 border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400 hover:text-purple-900 transition-all duration-300 font-bold hover:shadow-lg hover:shadow-yellow-400/30"
              >
                Sign In
              </a>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-transparent border-2 border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition-all duration-300 font-bold hover:shadow-lg hover:shadow-red-400/30 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}