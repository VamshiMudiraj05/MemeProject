import React from 'react';
import { User, Briefcase } from 'lucide-react';

const UserTypeSelector = ({ setUserType, nextStep }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Who are you registering as?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => {
            setUserType('influencer');
            nextStep();
          }}
          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex flex-col items-center">
            <User className="h-10 w-10 mb-3" />
            <h3 className="text-xl font-bold mb-2">Meme Page Owner</h3>
            <p className="text-gray-200">I create content and want to work with brands</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            setUserType('brand');
            nextStep();
          }}
          className="bg-gradient-to-r from-pink-600 to-yellow-500 hover:from-yellow-500 hover:to-pink-600 text-white p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex flex-col items-center">
            <Briefcase className="h-10 w-10 mb-3" />
            <h3 className="text-xl font-bold mb-2">Brand/Advertiser</h3>
            <p className="text-gray-200">I want to promote my business through meme pages</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelector; 