import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { applyForPromotion } from '../../services/api';

function ApplicationModal({ isOpen, onClose, promotion }) {
  const [formData, setFormData] = useState({
    message: '',
    proposedPrice: '',
    proposedContent: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const applicationData = {
        promotionId: promotion._id,
        message: formData.message,
        proposedPrice: formData.proposedPrice ? parseFloat(formData.proposedPrice) : undefined,
        proposedContent: formData.proposedContent,
      };

      await applyForPromotion(applicationData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        message: '',
        proposedPrice: '',
        proposedContent: '',
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Apply for Promotion</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-900/30 border border-green-500 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-200">Application submitted successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-200">{error}</span>
            </div>
          )}

          {/* Promotion Details */}
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">{promotion.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{promotion.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-orange-400 font-medium">₹{promotion.budget}</span>
              <span className="text-gray-400">
                {promotion.platforms?.join(', ')}
              </span>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Why should we choose you? *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Tell us about your experience, audience, and why you're perfect for this promotion..."
                required
              />
            </div>

            {/* Proposed Price */}
            <div>
              <label htmlFor="proposedPrice" className="block text-sm font-medium text-gray-300 mb-2">
                Your Proposed Price (₹)
              </label>
              <input
                type="number"
                id="proposedPrice"
                name="proposedPrice"
                value={formData.proposedPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your proposed price"
                min="0"
                step="0.01"
              />
            </div>

            {/* Proposed Content */}
            <div>
              <label htmlFor="proposedContent" className="block text-sm font-medium text-gray-300 mb-2">
                Content Ideas
              </label>
              <textarea
                id="proposedContent"
                name="proposedContent"
                value={formData.proposedContent}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Share your content ideas for this promotion..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplicationModal; 