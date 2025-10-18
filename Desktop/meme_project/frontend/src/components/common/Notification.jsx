import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`min-w-[320px] max-w-md rounded-lg shadow-xl overflow-hidden border ${
        type === 'success' 
          ? 'bg-white border-green-200' 
          : 'bg-white border-red-200'
      }`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className={`text-sm font-medium ${
                type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}>
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'success' 
                    ? 'text-green-500 hover:text-green-600 focus:ring-green-500' 
                    : 'text-red-500 hover:text-red-600 focus:ring-red-500'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className={`h-1 w-full ${
          type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <div 
            className={`h-full ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{
              animation: 'shrink 5s linear forwards',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Notification; 