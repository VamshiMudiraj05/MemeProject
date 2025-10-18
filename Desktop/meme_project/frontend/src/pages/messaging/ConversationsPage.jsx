import React, { useState, useEffect } from 'react';
import { getConversations, getUnreadCount } from '../../services/api';
import { Link } from 'react-router-dom';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">Messages</h1>
            <p className="text-gray-200 mt-1 text-lg">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-200 font-medium">Live</span>
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-6">
          {error && (
            <div className="p-4 border-b border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {conversations.length === 0 ? (
            <div className="p-12 text-center backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow">No conversations yet</h3>
              <p className="text-gray-200 mb-6 text-lg">
                Start messaging with brands and influencers to collaborate on promotions.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Explore Promotions
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.conversationId}
                  to={`/dashboard/messages/${conversation.conversationId}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl transition-transform duration-200 group-hover:scale-[1.025] group-hover:shadow-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white/20">
                        <span className="text-white font-bold text-xl drop-shadow">
                          {conversation.otherParticipantType === 'Brand' 
                            ? conversation.otherParticipant.name?.charAt(0)?.toUpperCase()
                            : conversation.otherParticipant.alias?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <p className="text-lg font-bold text-white truncate drop-shadow">
                            {conversation.otherParticipantType === 'Brand' 
                              ? conversation.otherParticipant.name
                              : conversation.otherParticipant.alias}
                          </p>
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow">
                            {conversation.otherParticipantType}
                          </span>
                        </div>
                        <p className="text-base text-gray-200 truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 min-w-[70px]">
                      <span className="text-xs text-gray-300 font-medium">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage; 