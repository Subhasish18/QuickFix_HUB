import React from "react";

const ConfirmDialog = ({ show, onHide, onConfirm, title, message }) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ease-out"
        onClick={onHide}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 ease-out scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20"></div>
          
          {/* Content container */}
          <div className="relative bg-white rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Warning Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {title || "Confirm Action"}
                  </h3>
                </div>
                
                {/* Close button */}
                <button
                  onClick={onHide}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <svg className="w-5 h-5 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p className="text-gray-600 text-base leading-relaxed">
                {message || "Are you sure you want to continue?"}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-3">
              {/* Cancel Button */}
              <button
                onClick={onHide}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl
                         hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
                         focus:outline-none focus:ring-4 focus:ring-gray-200
                         transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              
              {/* Confirm Button */}
              <button
                onClick={onConfirm}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl
                         hover:from-red-600 hover:to-red-700 hover:shadow-lg
                         focus:outline-none focus:ring-4 focus:ring-red-200
                         transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Yes, Confirm</span>
                </div>
              </button>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl -z-10 opacity-50"></div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;