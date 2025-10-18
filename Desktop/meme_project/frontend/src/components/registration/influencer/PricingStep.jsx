import React from 'react';
import { DollarSign, ArrowLeft, ArrowRight } from 'lucide-react';

const PricingStep = ({ formData, handleChange, prevStep, nextStep }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <DollarSign className="h-6 w-6" /> Your Pricing
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Story Price (INR)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">₹</span>
              </div>
              <input
                type="number"
                step="1"
                min="0"
                name="storyPrice"
                value={formData.storyPrice}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 4000"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Post Price (INR)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">₹</span>
              </div>
              <input
                type="number"
                step="1"
                min="0"
                name="postPrice"
                value={formData.postPrice}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 8000"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Reel Price (INR)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">₹</span>
              </div>
              <input
                type="number"
                step="1"
                min="0"
                name="reelPrice"
                value={formData.reelPrice}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 12000"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="negotiable"
            name="negotiable"
            checked={formData.negotiable}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
          />
          <label htmlFor="negotiable" className="ml-2 block text-gray-300">
            My prices are negotiable
          </label>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Additional Notes About Pricing (Optional)</label>
          <textarea
            name="pricingNotes"
            value={formData.pricingNotes || ''}
            onChange={handleChange}
            rows="4"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="E.g. Bundle discounts, long-term partnership rates, etc."
          ></textarea>
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
          Next: Verification <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PricingStep;
