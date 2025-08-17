import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import  './ToastMessage.css';


const ToastMessage = () => {
  const [theme, setTheme] = useState('light');

  const showSuccessToast = () => {
    toast.success('Operation completed successfully!', {
      className: 'custom-toast-success',
      progressClassName: 'custom-progress-success'
    });
  };

  const showErrorToast = () => {
    toast.error('Something went wrong!', {
      className: 'custom-toast-error',
      progressClassName: 'custom-progress-error'
    });
  };

  const showInfoToast = () => {
    toast.info('Here\'s some useful information', {
      className: 'custom-toast-info',
      progressClassName: 'custom-progress-info'
    });
  };

  const showWarningToast = () => {
    toast.warning('Please be careful!', {
      className: 'custom-toast-warning',
      progressClassName: 'custom-progress-warning'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Enhanced Toast Notifications</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Theme Selector</h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                theme === 'light' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Light Theme
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Dark Theme
            </button>
            <button
              onClick={() => setTheme('colored')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                theme === 'colored' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Colored Theme
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Toast Notifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={showSuccessToast}
              className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Success Toast
            </button>
            <button
              onClick={showErrorToast}
              className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Error Toast
            </button>
            <button
              onClick={showInfoToast}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Info Toast
            </button>
            <button
              onClick={showWarningToast}
              className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Warning Toast
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced ToastContainer with custom styling */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        className="custom-toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-progress"
        closeButtonStyle={{
          color: '#64748b',
          opacity: 0.7
        }}
      />
    </div>
  );
};

export default ToastMessage;