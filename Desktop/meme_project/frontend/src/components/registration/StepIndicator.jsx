import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ number, active, complete = false, label }) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          active 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
            : complete 
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-400'
        }`}
      >
        {complete ? <Check className="h-5 w-5" /> : number}
      </div>
      <span className={`mt-2 text-sm transition-colors duration-300 ${
        active || complete ? 'text-gray-200' : 'text-gray-500'
      }`}>
        {label}
      </span>
    </div>
  );
};

export default StepIndicator; 