import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const completedJobs = [
  {
    id: "comp1",
    customer: "Ari",
    type: "Drain Cleaning",
    date: "Apr 28, 2025",
    payment: "₹120",
    rating: 5,
    feedback: "Excellent service, drain works perfect now."
  },
  {
    id: "comp2",
    customer: "Maharaj",
    type: "Faucet Replacement",
    date: "Apr 25, 2025",
    payment: "₹195",
    rating: 4,
    feedback: "Good work, very professional."
  },
  {
    id: "comp3",
    customer: "Subh",
    type: "Pipe Repair",
    date: "Apr 22, 2025",
    payment: "₹150",
    rating: 5,
    feedback: "Fixed our emergency leak quickly. Would hire again!"
  }
];

const CompletedJobsCard = () => {
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill={i < rating ? '#ffc107' : '#e9ecef'}
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
        <Card.Title as="h5" className="mb-0">Recent Completed Jobs</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="d-flex flex-column gap-3">
          {completedJobs.map((job) => (
            <div
              key={job.id}
              className="d-flex justify-content-between align-items-start border-bottom pb-3"
              style={{ borderBottom: job.id === completedJobs[completedJobs.length - 1].id ? 'none' : '' }}
            >
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="success" className="d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      fill="currentColor"
                      className="bi bi-check me-1"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    </svg>
                    Completed
                  </Badge>
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>{job.date}</span>
                </div>
                <h6 className="mt-2 mb-1">{job.type}</h6>
                <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>{job.customer}</p>
                <div className="d-flex align-items-center gap-1">
                  {renderStars(job.rating)}
                </div>
                <p className="fst-italic mt-1" style={{ fontSize: '0.75rem' }}>"{job.feedback}"</p>
              </div>
              <span className="fw-semibold text-success">{job.payment}</span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CompletedJobsCard;