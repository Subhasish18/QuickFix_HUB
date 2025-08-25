import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import Map from '../Map';
import './UserProfile.css';

const dashboardStyles = {
  card: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md",
  cardHeader: "bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4",
  cardTitle: "text-xl font-bold text-white flex items-center space-x-3",
  primaryButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2",
};

const ConfirmDialog = ({ show, onHide, onConfirm, title, message }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100] ${show ? '' : 'hidden'}`}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-modalSlideIn">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-['Inter']">{title}</h3>
              <p className="text-sm text-gray-500 font-['Inter']">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 font-['Inter']">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onHide}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200 font-['Inter']"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 font-['Inter']"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfile = ({ user, onEdit }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLocationCollapsed, setIsLocationCollapsed] = useState(true);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return isNaN(date) ? 'Unknown' : date.toLocaleDateString(undefined, options);
  };

  const createdAt = formatDate(user.createdAt || '2023-01-01');
  const initials = getInitials(user.name);

  const toggleLocation = () => {
    setIsLocationCollapsed(!isLocationCollapsed);
  };

  return (
    <div className="animate-slideInUp">
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
        }
        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s ease-out forwards;
        }
        .collapsible-section {
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
          overflow: hidden;
        }
        .collapsible-section.collapsed {
          max-height: 0;
          opacity: 0;
        }
        .collapsible-section.expanded {
          max-height: 500px; /* Adjust based on map height */
          opacity: 1;
        }
      `}</style>

      <div className={dashboardStyles.card}>
        <div className={dashboardStyles.cardHeader}>
          <div className="flex items-center justify-between">
            <h3 className={dashboardStyles.cardTitle}>
              <User className="h-6 w-6 text-white" />
              <span className="font-['Inter']">User Profile</span>
            </h3>
            <button
              onClick={() => setShowConfirmDialog(true)}
              className={dashboardStyles.primaryButton}
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white flex items-center justify-center text-lg font-medium" style={{ width: '64px', height: '64px' }}>
              {initials}
            </div>
            <div>
              <h5 className="text-xl font-semibold text-gray-900 font-['Inter']">{user.name || 'No name available'}</h5>
              <p className="text-sm text-gray-500 font-['Inter']">Member since {createdAt}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Email</span>
                  <div className="text-sm font-medium text-gray-900 font-['Inter']">{user.email}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">Phone</span>
                  <div className="text-sm font-medium text-gray-900 font-['Inter']">{user.phoneNumber || 'N/A'}</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-600" />
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">State</span>
                  <div className="text-sm font-medium text-gray-900 font-['Inter']">{user.state || 'No state provided'}</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-600" />
                <div>
                  <span className="text-sm font-medium text-gray-500 font-['Inter']">City</span>
                  <div className="text-sm font-medium text-gray-900 font-['Inter']">{user.city || 'No city provided'}</div>
                </div>
              </div>
            </div>
          </div>

          {user.city && user.state && (
            <div className="mt-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center font-['Inter']">
                    <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                    Location
                  </h4>
                  <button
                    onClick={toggleLocation}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm"
                  >
                    {isLocationCollapsed ? (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span>Show Map</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        <span>Hide Map</span>
                      </>
                    )}
                  </button>
                </div>
                <div className={`collapsible-section ${isLocationCollapsed ? 'collapsed' : 'expanded'}`}>
                  <div className="p-4 pt-0">
                    <div style={{ width: '100%', aspectRatio: '16/9', minHeight: '200px' }}>
                      <Map city={user.city} state={user.state} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        show={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          setShowConfirmDialog(false);
          setTimeout(() => {
            if (onEdit) onEdit();
          }, 200);
        }}
        title="Confirm Edit"
        message="Are you sure you want to edit this profile?"
      />
    </div>
  );
};

export default UserProfile;