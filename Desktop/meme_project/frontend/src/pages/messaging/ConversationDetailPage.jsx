import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConversationMessages, sendMessage } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ConversationDetailPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [otherType, setOtherType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchMessages();
    setTimeout(() => inputRef.current?.focus(), 200);
    // eslint-disable-next-line
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const data = await getConversationMessages(conversationId);
      setMessages(data);
      if (data.length > 0) {
        // Figure out the other participant and type
        const first = data[0];
        let mineId = user?.profileId;
        let mineType = user?.userType === 'brand' ? 'Brand' : 'Influencer';
        let other, otherType;
        if (first.sender._id === mineId && first.senderModel === mineType) {
          other = first.recipient;
          otherType = first.recipientModel;
        } else {
          other = first.sender;
          otherType = first.senderModel;
        }
        setOtherParticipant(other);
        setOtherType(otherType);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || !otherParticipant || !otherType) return;
    setSending(true);
    try {
      await sendMessage({
        recipientId: otherParticipant._id,
        recipientType: otherType,
        content: input.trim(),
        messageType: 'text',
      });
      setInput('');
      fetchMessages();
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const renderMessage = (msg, idx) => {
    const mineId = user?.profileId;
    const mineType = user?.userType === 'brand' ? 'Brand' : 'Influencer';
    const isOwn = msg.sender._id === mineId && msg.senderModel === mineType;
    const showDate = idx === 0 || formatDate(msg.createdAt) !== formatDate(messages[idx - 1].createdAt);
    // Show sender name and type above each message
    let senderName = '';
    if (isOwn) {
      if (user.userType === 'brand') {
        senderName = user.fullName || user.companyName || user.email || 'Brand';
      } else {
        senderName = user.alias || user.name || user.email || 'Influencer';
      }
    } else {
      if (msg.senderModel === 'Brand') {
        senderName = msg.sender.fullName || msg.sender.companyName || msg.sender.name || msg.sender.email || 'Brand';
      } else {
        senderName = msg.sender.alias || msg.sender.name || msg.sender.email || 'Influencer';
      }
    }
    const senderType = msg.senderModel;
    return (
      <div key={msg._id}>
        {showDate && (
          <div className="flex justify-center my-4">
            <span className="bg-gray-800/80 text-gray-300 text-xs px-3 py-1 rounded-full shadow">
              {formatDate(msg.createdAt)}
            </span>
          </div>
        )}
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
          <div className={`max-w-[70%] ${isOwn ? 'ml-8' : 'mr-8'}`}>
            <div className={`text-xs mb-1 ${isOwn ? 'text-right text-blue-300' : 'text-left text-pink-300'}`}>{senderName} <span className="ml-1 text-[10px] text-gray-400">({senderType})</span></div>
            <div className={`rounded-2xl px-4 py-2 shadow-lg break-words ${
              isOwn
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                : 'bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-purple-900/80 text-gray-100 border border-gray-700 backdrop-blur-md'
            }`}>
              {msg.content}
            </div>
            <div className={`text-[11px] mt-1 ${isOwn ? 'text-right text-blue-200' : 'text-left text-gray-400'}`}>{formatTime(msg.createdAt)}</div>
          </div>
        </div>
      </div>
    );
  };

  // Helper to render profile details
  const renderProfileModal = () => {
    if (!otherParticipant) return null;
    const isBrand = otherType === 'Brand';
    const displayName = isBrand
      ? (otherParticipant.fullName || otherParticipant.companyName || otherParticipant.name || otherParticipant.email || 'Brand')
      : (otherParticipant.alias || otherParticipant.name || otherParticipant.email || 'Influencer');
    const avatarLetter = isBrand
      ? (otherParticipant.fullName?.[0] || otherParticipant.companyName?.[0] || otherParticipant.name?.[0] || 'B')
      : (otherParticipant.alias?.[0] || otherParticipant.name?.[0] || 'I');
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-purple-700">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            onClick={() => setShowProfileModal(false)}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl text-white font-bold mb-4">
              {avatarLetter.toUpperCase()}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {displayName}
            </h3>
            <div className="text-purple-400 font-semibold mb-2">{otherType}</div>
            {isBrand && otherParticipant.companyName && (
              <div className="text-gray-300 mb-2">Company: {otherParticipant.companyName}</div>
            )}
            {isBrand && otherParticipant.fullName && (
              <div className="text-gray-300 mb-2">Full Name: {otherParticipant.fullName}</div>
            )}
            <div className="text-gray-300 mb-2">{otherParticipant.email}</div>
            {otherParticipant.instagram && (
              <div className="text-gray-400 mb-2">Instagram: @{otherParticipant.instagram}</div>
            )}
            {otherParticipant.industry && (
              <div className="text-gray-400 mb-2">Industry: {otherParticipant.industry}</div>
            )}
            {otherParticipant.monthlyBudget && (
              <div className="text-gray-400 mb-2">Monthly Budget: ₹{otherParticipant.monthlyBudget.toLocaleString()}</div>
            )}
            {otherParticipant.campaignDescription && (
              <div className="text-gray-400 mb-2">Campaign: {otherParticipant.campaignDescription}</div>
            )}
            {/* Influencer-specific fields */}
            {!isBrand && otherParticipant.accountType && (
              <div className="text-gray-400 mb-2">Account Type: {otherParticipant.accountType}</div>
            )}
            {!isBrand && otherParticipant.followers && (
              <div className="text-gray-400 mb-2">Followers: {otherParticipant.followers.toLocaleString()}</div>
            )}
            {!isBrand && otherParticipant.engagement && (
              <div className="text-gray-400 mb-2">Engagement: {otherParticipant.engagement}%</div>
            )}
            {!isBrand && otherParticipant.bio && (
              <div className="text-gray-400 mb-2">Bio: {otherParticipant.bio}</div>
            )}
            {!isBrand && otherParticipant.pricing && (
              <div className="text-gray-400 mb-2">
                <div>Story Price: ₹{otherParticipant.pricing.storyPrice}</div>
                <div>Post Price: ₹{otherParticipant.pricing.postPrice}</div>
                <div>Reel Price: ₹{otherParticipant.pricing.reelPrice}</div>
                <div>Negotiable: {otherParticipant.pricing.negotiable ? 'Yes' : 'No'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading chat</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard/messages')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Messages
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="ml-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-purple-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-pink-900/80 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate('/dashboard/messages')}
            className="p-2 hover:bg-gray-800/40 rounded-lg"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-purple-600 text-xs"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="flex-1 text-center">
          <h2
            className="text-lg font-bold text-white cursor-pointer hover:underline"
            onClick={e => { e.stopPropagation(); setShowProfileModal(true); }}
            title="View profile details"
          >
            {(otherParticipant?.fullName || otherParticipant?.companyName || otherParticipant?.name || otherParticipant?.alias || otherParticipant?.email || 'Chat')} <span className="ml-1 text-xs text-gray-300">({otherType})</span>
          </h2>
          <div className="text-xs text-gray-300 mt-1">
            {otherParticipant?.email}
          </div>
        </div>
        <div className="w-8" />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-2 md:px-8 py-6" style={{ background: 'none' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start the conversation below!</p>
          </div>
        ) : (
          <div>
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <form
        className="sticky bottom-0 z-20 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-pink-900/80 px-4 py-4 flex items-center gap-2 shadow-2xl"
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <textarea
          ref={inputRef}
          className="flex-1 resize-none rounded-xl px-4 py-2 bg-gray-800/80 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-base shadow"
          rows={1}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={sending}
          style={{ minHeight: 40, maxHeight: 120 }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="ml-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
      {showProfileModal && renderProfileModal()}
    </div>
  );
};

export default ConversationDetailPage; 