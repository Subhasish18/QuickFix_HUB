import React from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileCard = () => {
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill={star <= rating ? '#ffc107' : '#e9ecef'}
        className="bi bi-star-fill"
        viewBox="0 0 16 16"
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg>
    ));
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Card.Title as="h5" className="mb-0">Service Provider Profile</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src="no pic man"
              alt="Profile"
              className="rounded-circle border border-primary"
              style={{ width: '64px', height: '64px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.outerHTML = `<div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style="width: 64px; height: 64px; font-size: 1.5rem;">FD</div>`;
              }}
            />
            <div>
              <h5 className="mb-1">Farebi Dalle</h5>
              <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Professional Plumber</p>
              <div className="d-flex align-items-center gap-1">
                {renderStars(4)}
                <span className="ms-1" style={{ fontSize: '0.875rem' }}>(4.2)</span>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <span className="d-block" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Experience</span>
                <span className="fs-5 fw-semibold">3 years</span>
              </div>
            </div>
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <span className="d-block" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Jobs Completed</span>
                <span className="fs-5 fw-semibold">35</span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column gap-4">
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Profile Completion</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>65%</span>
              </div>
              <ProgressBar now={65} variant="primary" style={{ height: '8px' }} className="mt-1" />
            </div>
            
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Skills</span>
              <div className="d-flex flex-wrap gap-2 mt-2">
                <Badge bg="secondary">Plumbing</Badge>
                <Badge bg="secondary">Pipe Fitting</Badge>
                <Badge bg="secondary">Leak Repair</Badge>
                <Badge bg="secondary">Drainage</Badge>
                <Badge bg="secondary">Installation</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;