import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Laugh, ArrowLeft } from 'lucide-react';
import { updateUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    alias: '',
    instagram: '',
    followers: '',
    engagement: '',
    bio: '',
    profilePic: null,
    // ... any other fields you may add later
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        alias: user.alias || '',
        instagram: user.instagram || '',
        followers: user.followers || '',
        engagement: user.engagement || '',
        bio: user.bio || '',
        profilePic: user.profilePic || null,
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
      // setUser(updatedUser.data); // Removed to prevent logout
      navigate('/dashboard'); // Navigate to dashboard (DashboardRouter will handle user type)
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
          <h1 className="text-3xl font-bold ml-4">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl p-8">
          {error && <div className="bg-red-500 text-white p-3 rounded-md mb-6">{error}</div>}
          {/* Profile Picture */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              {formData.profilePic ? (
                <img
                  src={formData.profilePic}
                  alt={formData.alias}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-white">{formData.alias?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <div>
              <label htmlFor="profilePic" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                Upload New Picture
              </label>
              <input id="profilePic" name="profilePic" type="file" className="hidden" />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Full Name / Alias</label>
              <input
                type="text"
                name="alias"
                value={formData.alias || ''}
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
              <label className="block text-gray-300 mb-2">Followers</label>
              <input
                type="number"
                name="followers"
                value={formData.followers || ''}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Engagement Rate (%)</label>
              <input
                type="text"
                name="engagement"
                value={formData.engagement || ''}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
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