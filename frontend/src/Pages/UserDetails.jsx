import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import UserProfile from './Components/UserProfile/UserProfile';
import UserBookings from './Components/UserBookings/UserBookings';
import UserEditForm from './Components/UserEditForm/UserEditForm';
import BookLoader from './Components/BookLoader';
import Navbar from './UserLandingPage/Navbar';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserDetails.css';

const UserDetails = ({ onLogout }) => {
  // data + ui state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // single confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('Confirm Action');
  const [confirmMessage, setConfirmMessage] = useState('Are you sure you want to continue?');

  // --- helpers ---
  const openConfirm = ({ action, title, message }) => {
    setConfirmAction(() => action);
    if (title) setConfirmTitle(title);
    if (message) setConfirmMessage(message);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmAction(null);
    setConfirmTitle('Confirm Action');
    setConfirmMessage('Are you sure you want to continue?');
  };

  const fetchUserProfile = async (idToken) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/user-details/profile', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!response.data._id) throw new Error('Invalid user data: ID not found');
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      const msg = err?.response?.data?.message || err.message || 'Failed to load user profile';
      setError(msg);
      toast.error(msg, {
        toastId: 'user-profile-error',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // auth watcher
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setError('User not authenticated. Please log in.');
        toast.error('User not authenticated. Please log in.', {
          toastId: 'user-auth-error',
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
        });
        setLoading(false);
        return;
      }
      const idToken = await currentUser.getIdToken(true);
      await fetchUserProfile(idToken);
    });
    return () => unsubscribe();
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      // clear client state first
      localStorage.removeItem('userData');
      sessionStorage.removeItem('showLoginMessage');
      await signOut(auth);
      onLogout && onLogout();
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out. Please try again.', {
        toastId: 'logout-error',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  // open edit
  const handleStartEdit = () => {
    // Editing is non-destructive; no need to confirm opening form.
    setIsEditing(true);
  };

  // save (after EditForm submits validated data)
  const handleRequestSave = (formData) => {
    openConfirm({
      title: 'Confirm Update',
      message: 'Are you sure you want to save these profile changes?',
      action: () => saveUser(formData),
    });
  };

  const saveUser = async (formData) => {
    try {
      setSaving(true);
      const auth = getAuth();
      const current = auth.currentUser;
      if (!current) throw new Error('User not authenticated');
      const token = await current.getIdToken(true);

      const { data } = await axios.put(
        'http://localhost:5000/api/user-details/edit',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = data?.user || data;
      setUser(updated);
      setIsEditing(false);

      toast.success('✅ Profile updated successfully!', {
        toastId: 'profile-update-success',
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: true,
      });
    } catch (err) {
      console.error('Update error:', err);
      const msg = err?.response?.data?.message || err.message || 'Failed to update profile';
      toast.error(msg, {
        toastId: 'profile-update-error',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } finally {
      setSaving(false);
      closeConfirm();
    }
  };

  // tabs/content
  const renderContent = () => {
    if (loading) return <BookLoader />;
    if (error) return <div className="error-message">{error}</div>;
    if (!user) return <div className="not-found">User not found</div>;

    if (isEditing) {
      return (
        <UserEditForm
          show={true}
          onHide={() => setIsEditing(false)}
          user={user}
          onSubmit={handleRequestSave}     // calls parent, which confirms & saves
          submitting={saving}               // show spinner in button while saving
        />
      );
    }

    switch (activeTab) {
      case 'profile':
        return <UserProfile user={user} onEdit={handleStartEdit} />;
      case 'bookings':
        return <UserBookings userId={user._id} />;
      default:
        return <UserProfile user={user} onEdit={handleStartEdit} />;
    }
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <div className="user-details-container">
        <div className="user-details-header">
          <h1>User Details</h1>
          {!isEditing && user && (
            <div className="user-details-navigation">
              <button
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
            </div>
          )}
        </div>
        <div className="user-details-content">{renderContent()}</div>
      </div>

      <ConfirmDialog
        show={confirmOpen}
        onHide={closeConfirm}
        onConfirm={() => {
          if (confirmAction) confirmAction();
        }}
        title={confirmTitle}
        message={confirmMessage}
      />
    </div>
  );
};

export default UserDetails;
