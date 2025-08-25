import React, { useState, useEffect } from 'react';

const BookLoader = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const messages = [
    "Preparing your workspace...",
    "Loading user details...",
    "Setting up your dashboard...",
    "Almost ready..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 80);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes flipPage {
          0% {
            transform: rotateY(0deg);
            background: linear-gradient(135deg, #3b82f6, #1e40af);
          }
          25% {
            background: linear-gradient(135deg, #6366f1, #4338ca);
          }
          50% {
            transform: rotateY(-180deg);
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          }
          75% {
            background: linear-gradient(135deg, #a855f7, #9333ea);
          }
          100% {
            transform: rotateY(-180deg);
            background: linear-gradient(135deg, #3b82f6, #1e40af);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes progressFill {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        .book-container {
          animation: float 3s ease-in-out infinite;
        }
        
        .page {
          animation: flipPage 2.4s infinite ease-in-out;
        }
        
        .page-1 {
          animation-delay: 0s;
        }
        
        .page-2 {
          animation-delay: 0.4s;
        }
        
        .page-3 {
          animation-delay: 0.8s;
        }
        
        .page-4 {
          animation-delay: 1.2s;
        }
        
        .loading-text {
          animation: slideUp 0.5s ease-out;
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .pulse-dot {
          animation: pulse 1.5s infinite ease-in-out;
        }
        
        .pulse-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .pulse-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>

      <div className="text-center">
        {/* Enhanced Book Loader */}
        <div className="book-container relative mb-8">
          {/* Book Base */}
          <div className="relative w-20 h-28 mx-auto">
            {/* Book Spine */}
            <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-l-lg shadow-lg"></div>
            
            {/* Book Cover */}
            <div className="absolute left-2 top-0 w-16 h-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-r-lg shadow-xl"></div>
            
            {/* Animated Pages */}
            <div className="absolute left-2 top-1 w-16 h-26 perspective-1000">
              <div className="page page-1 absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-r-lg shadow-md" style={{transformOrigin: 'left center', zIndex: 4}}></div>
              <div className="page page-2 absolute w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-r-lg shadow-md" style={{transformOrigin: 'left center', zIndex: 3}}></div>
              <div className="page page-3 absolute w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-r-lg shadow-md" style={{transformOrigin: 'left center', zIndex: 2}}></div>
              <div className="page page-4 absolute w-full h-full bg-gradient-to-br from-violet-500 to-violet-600 rounded-r-lg shadow-md" style={{transformOrigin: 'left center', zIndex: 1}}></div>
            </div>
            
            {/* Book Details */}
            <div className="absolute left-3 top-2 w-14 h-6 bg-white bg-opacity-20 rounded backdrop-blur-sm"></div>
            <div className="absolute left-4 top-4 w-12 h-1 bg-white bg-opacity-40 rounded"></div>
            <div className="absolute left-4 top-6 w-10 h-0.5 bg-white bg-opacity-30 rounded"></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute -top-4 -left-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 pulse-dot"></div>
          <div className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-50 pulse-dot"></div>
          <div className="absolute -bottom-3 left-2 w-1 h-1 bg-purple-400 rounded-full opacity-70 pulse-dot"></div>
        </div>

        {/* Enhanced Loading Message */}
        <div className="space-y-4">
          <div className="loading-text">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {messages[currentMessage]}
            </h3>
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out shimmer-effect"
                style={{width: `${progress}%`}}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}% Complete</p>
          </div>
          
          {/* Animated Dots */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full pulse-dot"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full pulse-dot"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full pulse-dot"></div>
          </div>
        </div>

        {/* Alternative Circular Loader Design */}
        <div className="mt-12 p-6 bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl shadow-lg border border-white border-opacity-50">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              {/* Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
              
              {/* Inner Content */}
              <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            
            <p className="text-sm font-medium text-gray-700">Preparing your experience</p>
            <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLoader;