import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpcomingJobsCard = () => {
  const upcomingJobs = [
    {
      id: "job-4",
      customer: "Laura Martinez",
      type: "Water Heater Service",
      address: "456 Elm Street, Lakewood",
      date: "May 4, 2025",
      time: "2:00 PM - 4:30 PM",
    },
    {
      id: "job-5",
      customer: "Chucha Stark",
      type: "Bathroom Sink Installation",
      address: "234 Cedar Lane, Lakewood",
      date: "May 6, 2025",
      time: "10:00 AM - 12:00 PM",
    }
  ];

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Card.Title as="h5" className="mb-0">Upcoming Jobs</Card.Title>
      </Card.Header>
      <Card.Body>
        {upcomingJobs.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="border rounded p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="mb-0">{job.type}</h6>
                  <Badge bg="primary">{job.date}</Badge>
                </div>
                <p className="mt-1 mb-0">{job.customer}</p>
                <div className="mt-2 text-muted" style={{ fontSize: '0.875rem' }}>
                  <div className="d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-clock me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 3.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM8 8V5.5a.5.5 0 0 1 1 0V7h1.5a.5.5 0 0 1 0 1H8.5a.5.5 0 0 1-.5-.5z"/>
                      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8z"/>
                    </svg>
                    <span>{job.time}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-geo-alt me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                    <span>{job.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No upcoming jobs</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UpcomingJobsCard;