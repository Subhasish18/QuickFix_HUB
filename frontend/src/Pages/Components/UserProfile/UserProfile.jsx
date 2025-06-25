import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import UserEditForm from '../UserEditForm/UserEditForm';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = ({ user, onEditSubmit }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  console.log('UserProfile rendered with user:', user); // Debug log

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
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

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title as="h5" className="mb-0">User Profile</Card.Title>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              console.log('Edit button clicked'); // Debug log
              setShowEditModal(true);
            }}
          >
            <i className="bi bi-pencil"></i> Edit
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
              {initials}
            </div>
            <div>
              <h5 className="mb-1">{user.name || 'No name available'}</h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                Member since {createdAt}
              </p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <span className="d-block fw-medium text-muted">Email</span>
                <span className="fs-6">{user.email}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <span className="d-block fw-medium text-muted">Phone</span>
                <span className="fs-6">{user.phoneNumber || 'N/A'}</span>
              </div>
            </div>
            <div className="col-12">
              <div className="bg-light p-3 rounded">
                <span className="d-block fw-medium text-muted">Location</span>
                <span className="fs-6">{user.location || 'No location provided'}</span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <UserEditForm
        show={showEditModal}
        onHide={() => {
          console.log('Modal closed'); // Debug log
          setShowEditModal(false);
        }}
        user={user}
        onSubmit={(updatedUser) => {
          console.log('Edit form submitted with updatedUser:', updatedUser); // Debug log
          setShowEditModal(false);
          if (onEditSubmit) onEditSubmit(updatedUser);
        }}
      />
    </>
  );
};

export default UserProfile;