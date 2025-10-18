import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const VerificationStep = ({ formData, handleChange, prevStep, onSubmit }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <CheckCircle className="h-6 w-6" /> Verification & Profile
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Instagram Account Screenshot</label>
          <p className="text-sm text-gray-400 mb-3">
            Please upload a screenshot of your Instagram profile page showing your handle and follower count
          </p>
          <input
            type="file"
            name="verificationScreenshot"
            onChange={handleChange}
            accept="image/*"
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Bio / About</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell brands about your content style, audience interests, and what makes your page unique"
            required
          ></textarea>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Profile Picture (Optional)</label>
          <input
            type="file"
            name="profilePic"
            onChange={handleChange}
            accept="image/*"
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
          <p className="mt-1 text-sm text-gray-400">
            Your profile pic will only be visible to approved brands
          </p>
        </div>
        
        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
          <h3 className="text-lg font-medium text-white mb-3">Terms & Privacy</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                name="termsAccepted"
                checked={formData.termsAccepted || false}
                onChange={handleChange}
                className="h-5 w-5 mt-1 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
              </label>
            </div>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="communications"
                name="emailsAccepted"
                checked={formData.emailsAccepted || false}
                onChange={handleChange}
                className="h-5 w-5 mt-1 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="communications" className="ml-2 block text-sm text-gray-300">
                I agree to receive emails about brand opportunities, platform updates, and promotional offers
              </label>
            </div>
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

export default VerificationStep; 