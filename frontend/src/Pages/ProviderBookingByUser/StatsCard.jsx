import React from 'react';
import { Card } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const StatsCard = () => {
  const stats = [
    { 
      title: "This Month",
      jobs: 8,
      earnings: "₹970",
      percent: 75
    },
    { 
      title: "Previous Month",
      jobs: 12,
      earnings: "₹1,435",
      percent: 92
    }
  ];

  return (
    <Card className="shadow-sm">
      <Card.Body className="pt-4">
        <div className="row g-3">
          {stats.map((stat, index) => (
            <div key={index} className="col-6 d-flex align-items-center">
              <div style={{ width: '64px', height: '64px' }}>
                <CircularProgressbar
                  value={stat.percent}
                  text={`${stat.percent}%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: `rgb(28, 100, 242)`,
                    textColor: '#1c64f2',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
              <div className="ms-3">
                <h6 className="mb-1">{stat.title}</h6>
                <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>{stat.jobs} jobs</p>
                <p className="fw-semibold mb-0" style={{ color: '#007bff' }}>{stat.earnings}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-2 mt-3">
          <div className="col-4">
            <div className="bg-light p-2 rounded text-center">
              <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Acceptance Rate</p>
              <p className="fw-semibold mb-0">89%</p>
            </div>
          </div>
          <div className="col-4">
            <div className="bg-light p-2 rounded text-center">
              <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Avg. Rating</p>
              <p className="fw-semibold mb-0">4.8/5</p>
            </div>
          </div>
          <div className="col-4">
            <div className="bg-light p-2 rounded text-center">
              <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Response Time</p>
              <p className="fw-semibold mb-0">20 min</p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;