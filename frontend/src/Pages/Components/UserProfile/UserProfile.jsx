import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import Map from '../Map';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = ({ user, onEdit }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title as="h5" className="mb-0">User Profile</Card.Title>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowConfirmDialog(true)}
          >
            <i className="bi bi-pencil"></i> Edit
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
              style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}
            >
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
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <span className="d-block fw-medium text-muted">State</span>
                <span className="fs-6">{user.state || 'No state provided'}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <span className="d-block fw-medium text-muted">City</span>
                <span className="fs-6">{user.city || 'No city provided'}</span>
              </div>
            </div>
          </div>

          {user.city && user.state && (
            <div className="mt-4">
              <div style={{ width: '100%', aspectRatio: '16/9', minHeight: '200px' }}>
                <Map city={user.city} state={user.state} />
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          // First close confirm dialog
          setShowConfirmDialog(false);

          // Then trigger edit modal AFTER confirm dialog finishes closing
          setTimeout(() => {
            if (onEdit) onEdit();
          }, 200);
        }}
        title="Confirm Edit"
        message="Are you sure you want to edit this profile?"
      />
    </>
  );
};

export default UserProfile;
