import React from 'react';

const UserProfileModal = ({ user, open, onClose }) => {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <div className="mb-2"><strong>ID:</strong> {user._id}</div>
        <div className="mb-2"><strong>Name:</strong> {user.name}</div>
        <div className="mb-2"><strong>Email:</strong> {user.email}</div>
        {user.location && <div className="mb-2"><strong>Location:</strong> {user.location}</div>}
        {/* Add more fields as needed */}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserProfileModal;