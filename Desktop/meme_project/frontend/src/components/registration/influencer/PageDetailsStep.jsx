import React from 'react';
import { Instagram, ArrowLeft, ArrowRight } from 'lucide-react';

const accountTypes = ['Meme Page', 'Fan Page', 'Fitness', 'Fashion', 'Cricket', 'Other'];

const PageDetailsStep = ({ formData, handleChange, prevStep, nextStep }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <Instagram className="h-6 w-6" /> Page Details
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Instagram Handle</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">@</span>
            </div>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your_meme_page"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Followers Count</label>
            <input
              type="number"
              name="followers"
              value={formData.followers}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. 50000"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Accounts Reached in Last 30 Days</label>
            <input
              type="number"
              name="engagement"
              value={formData.engagement}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. 10000"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Account Type</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {accountTypes.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="radio"
                  id={`account-type-${type}`}
                  name="accountType"
                  value={type}
                  checked={formData.accountType === type}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded-full bg-gray-700"
                />
                <label htmlFor={`account-type-${type}`} className="ml-2 block text-sm text-gray-300">
                  {type}
                </label>
              </div>
            ))}
          </div>
          {formData.accountType === 'Other' && (
            <div className="mt-3">
              <input
                type="text"
                name="customAccountType"
                value={formData.customAccountType || ''}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your account type"
                required
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Sample Post URLs (at least 1)</label>
          <div className="space-y-3">
            {[0, 1, 2].map((index) => (
              <input
                key={index}
                type="url"
                name={`samplePosts[${index}]`}
                value={formData.samplePosts[index]}
                onChange={(e) => {
                  const newSamplePosts = [...formData.samplePosts];
                  newSamplePosts[index] = e.target.value;
                  handleChange({ target: { name: 'samplePosts', value: newSamplePosts } });
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`https://www.instagram.com/p/example${index + 1}`}
                required={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-600 transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:from-purple-600 hover:to-blue-500 transition-all duration-300"
        >
          Next: Pricing <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PageDetailsStep; 