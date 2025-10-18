import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { updateUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function BrandEditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    instagram: '',
    industry: '',
    monthlyBudget: '',
    campaignDescription: '',
    logo: null,
    email: '',
    // ... any other fields you may add later
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        companyName: user.companyName || '',
        instagram: user.instagram || '',
        industry: user.industry || '',
        monthlyBudget: user.monthlyBudget || '',
        campaignDescription: user.campaignDescription || '',
        logo: user.logo?.url || null,
        email: user.email || '',
        // ... any other fields
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateUser(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200">
            <ArrowLeft className="h-6 w-6" />
          </a>
          <h1 className="text-3xl font-bold ml-4">Edit Brand Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl p-8">
          {error && <div className="bg-red-500 text-white p-3 rounded-md mb-6">{error}</div>}
          {/* Logo */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              {formData.logo ? (
                <img
                  src={formData.logo}
                  alt={formData.companyName}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-white">{formData.companyName?.[0]?.toUpperCase() || formData.fullName?.[0]?.toUpperCase() || 'B'}</span>
              )}
            </div>
            <div>
              <label htmlFor="logo" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                Upload New Logo
              </label>
              <input id="logo" name="logo" type="file" className="hidden" />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Instagram Handle</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram || ''}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry || ''}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Monthly Budget</label>
              <input
                type="number"
                name="monthlyBudget"
                value={formData.monthlyBudget || ''}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Campaign Description</label>
              <textarea
                name="campaignDescription"
                value={formData.campaignDescription || ''}
                onChange={handleChange}
                rows="4"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 