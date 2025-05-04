import React, { useState } from 'react';
import { Card, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const jobRequests = [
  {
    id: "job-1",
    customer: "Erwin",
    type: "Pipe Leak",
    address: "123 Maple St, Lakewood",
    date: "May 5, 2025",
    time: "10:00 AM - 12:00 PM",
    description: "Water leaking from under kitchen sink, needs urgent attention.",
    status: "pending"
  },
  {
    id: "job-2",
    customer: "James",
    type: "Toilet Installation",
    address: "45 Oak Ave, Lakewood",
    date: "May 7, 2025",
    time: "1:00 PM - 4:00 PM",
    description: "New toilet needs installation in master bathroom.",
    status: "pending"
  },
  {
    id: "job-3",
    customer: "John",
    type: "Shower Repair",
    address: "789 Pine Dr, Lakewood",
    date: "May 8, 2025",
    time: "9:00 AM - 11:00 AM",
    description: "Shower head not working properly, low water pressure.",
    status: "pending"
  }
];

const JobRequestsCard = () => {
  const [requests, setRequests] = useState(jobRequests);

  const acceptJob = (jobId) => {
    setRequests(prevRequests =>
      prevRequests.map(job => 
        job.id === jobId ? { ...job, status: "accepted" } : job
      )
    );
    alert("Job Accepted: You've successfully accepted this job request.");
  };

  const declineJob = (jobId) => {
    setRequests(prevRequests =>
      prevRequests.map(job => 
        job.id === jobId ? { ...job, status: "declined" } : job
      )
    );
    alert("Job Declined: You've declined this job request.");
  };

  const pendingRequests = requests.filter(job => job.status === "pending");
  const acceptedRequests = requests.filter(job => job.status === "accepted");

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Card.Title as="h5" className="mb-0">Job Requests</Card.Title>
        <Card.Text className="text-muted" style={{ fontSize: '0.875rem' }}>
          Manage your incoming service requests
        </Card.Text>
      </Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey="pending" id="job-requests-tabs" className="mb-3">
          <Tab
            eventKey="pending"
            title={
              <span>
                Pending
                {pendingRequests.length > 0 && (
                  <Badge bg="secondary" className="ms-2">
                    {pendingRequests.length}
                  </Badge>
                )}
              </span>
            }
          >
            <div className="d-flex flex-column gap-3">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((job) => (
                  <div key={job.id} className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{job.type}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>{job.customer}</p>
                      </div>
                      <Badge bg="primary">{job.date}</Badge>
                    </div>
                    <p className="mt-2 mb-0" style={{ fontSize: '0.875rem' }}>{job.description}</p>
                    <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>{job.address}</p>
                    <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>Time: {job.time}</p>
                    <div className="d-flex gap-2 mt-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => acceptJob(job.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => declineJob(job.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No pending requests</p>
                </div>
              )}
            </div>
          </Tab>
          
          <Tab
            eventKey="accepted"
            title={
              <span>
                Accepted
                {acceptedRequests.length > 0 && (
                  <Badge bg="secondary" className="ms-2">
                    {acceptedRequests.length}
                  </Badge>
                )}
              </span>
            }
          >
            <div className="d-flex flex-column gap-3">
              {acceptedRequests.length > 0 ? (
                acceptedRequests.map((job) => (
                  <div key={job.id} className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{job.type}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>{job.customer}</p>
                      </div>
                      <Badge bg="success">{job.date}</Badge>
                    </div>
                    <p className="mt-2 mb-0" style={{ fontSize: '0.875rem' }}>{job.description}</p>
                    <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>{job.address}</p>
                    <p className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>Time: {job.time}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No accepted jobs</p>
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </Card.Body>
      <Card.Footer className="border-top p-3">
        <Button variant="outline-secondary" className="w-100">
          View All Requests
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default JobRequestsCard;