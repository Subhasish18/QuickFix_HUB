import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const RatingsCard = () => {
  const ratings = {
    average: 4.7,
    total: 86,
    distribution: [
      { stars: 5, count: 63, percentage: 73 },
      { stars: 4, count: 19, percentage: 22 },
      { stars: 3, count: 3, percentage: 3 },
      { stars: 2, count: 1, percentage: 1 },
      { stars: 1, count: 0, percentage: 0 },
    ]
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
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
        <Card.Title as="h5" className="mb-0">Ratings & Reviews</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="row align-items-center">
          <div className="col-4 text-center">
            <div className="fs-1 fw-bold">{ratings.average}</div>
            <div className="d-flex justify-content-center mt-1">
              {renderStars(Math.round(ratings.average))}
            </div>
            <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
              {ratings.total} reviews
            </div>
          </div>

          <div className="col-8">
            {ratings.distribution.map((item) => (
              <div key={item.stars} className="d-flex align-items-center mb-1">
                <div className="d-flex align-items-center me-2" style={{ width: '40px' }}>
                  <span>{item.stars}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    className="bi bi-star-fill ms-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                </div>
                <ProgressBar
                  now={item.percentage}
                  variant="primary"
                  style={{ height: '8px', flex: 1 }}
                  className="me-2"
                />
                <span style={{ width: '40px', fontSize: '0.875rem' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-top">
          <h6 className="mb-3">Recent Comments</h6>
          <div className="d-flex flex-column gap-3">
            <div className="bg-light p-3 rounded">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-medium">Alex Williams</span>
                <div className="d-flex">
                  {renderStars(5)}
                </div>
              </div>
              <p className="mt-1 mb-0" style={{ fontSize: '0.875rem' }}>
                "Arrived on time and fixed our leak quickly. Very professional and cleaned up afterward."
              </p>
            </div>
            
            <div className="bg-light p-3 rounded">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-medium">Taylor Johnson</span>
                <div className="d-flex">
                  {renderStars(4)}
                </div>
              </div>
              <p className="mt-1 mb-0" style={{ fontSize: '0.875rem' }}>
                "Good service, fixed our issue but took a bit longer than expected."
              </p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RatingsCard;