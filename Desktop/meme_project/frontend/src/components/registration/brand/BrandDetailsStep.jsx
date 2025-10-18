import React from 'react';
import { Briefcase, ArrowLeft } from 'lucide-react';

const industries = ['Tech', 'Fashion', 'Food', 'Education', 'Finance', 'Health', 'Entertainment', 'Other'];

const BrandDetailsStep = ({ formData, handleChange, prevStep, onSubmit }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <Briefcase className="h-6 w-6" /> Brand Details
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your company name"
              required
            />
          </div>
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
                placeholder="your_company_handle"
                required
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Industry</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {industries.map((industry) => (
              <div key={industry} className="flex items-center">
                <input
                  type="radio"
                  id={`industry-${industry}`}
                  name="industry"
                  value={industry}
                  checked={formData.industry === industry}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded-full bg-gray-700"
                />
                <label htmlFor={`industry-${industry}`} className="ml-2 block text-sm text-gray-300">
                  {industry}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Monthly Marketing Budget (INR)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">₹</span>
            </div>
            <input
              type="number"
              step="1000"
              min="0"
              name="monthlyBudget"
              value={formData.monthlyBudget}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. 50000"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">What are you looking to achieve?</label>
          <textarea
            name="campaignDescription"
            value={formData.campaignDescription}
            onChange={handleChange}
            rows="3"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Briefly describe your marketing goals and what you're looking for from meme creators"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Company Logo (Optional)</label>
          <input
            type="file"
            name="logo"
            onChange={handleChange}
            accept="image/*"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
          type="submit"
          onClick={onSubmit}
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 hover:from-teal-600 hover:to-green-500 transition-all duration-300"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
};

export default BrandDetailsStep; 