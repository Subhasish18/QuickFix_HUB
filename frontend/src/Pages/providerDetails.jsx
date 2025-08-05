import { Card, Badge, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileCard = ({ serviceData }) => {
  
  const defaultData = {
    company: 'Service Provider',
    title: 'Professional Service Provider',
    rating: 4.2,
    category: 'General Services',
    image: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
    city: 'Unknown',
    state: 'Unknown'
  };
  
  const provider = serviceData || defaultData;
  
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
  
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
 
  const getSkillsForCategory = (category) => {
    const skillsMap = {
      'Cleaning': ['Deep Cleaning', 'Sanitization', 'Carpet Care', 'Window Cleaning'],
      'Gardening': ['Lawn Care', 'Pruning', 'Landscaping', 'Plant Care'],
      'Plumbing': ['Pipe Fitting', 'Leak Repair', 'Drainage', 'Installation'],
      'Electrical': ['Wiring', 'Installation', 'Repair', 'Maintenance'],
      'HVAC': ['AC Repair', 'Installation', 'Maintenance', 'Diagnostics'],
      'Painting': ['Interior Painting', 'Exterior Painting', 'Wall Prep', 'Color Consultation'],
      'General': ['Home Repair', 'Maintenance', 'Installation', 'Consultation']
    };
    return skillsMap[category] || skillsMap['General'];
  };
  
  // Generate consistent random stats based on provider name (seed-based randomization)
  const generateStats = (providerName) => {
    // Simple hash function to create a seed from the provider name
    let seed = 0;
    for (let i = 0; i < providerName.length; i++) {
      seed = ((seed << 5) - seed) + providerName.charCodeAt(i);
      seed = seed & seed; // Convert to 32-bit integer
    }
    
    // Seeded random number generator
    const seededRandom = (min, max) => {
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      return Math.floor(rnd * (max - min + 1)) + min;
    };
    
    // Generate stats based on rating (higher rating = better stats tendency)
    const ratingMultiplier = provider.rating / 5;
    
    const baseExperience = seededRandom(1, 8);
    const experience = Math.max(1, Math.floor(baseExperience * (0.7 + ratingMultiplier * 0.6)));
    
    const baseJobs = seededRandom(5, 150);
    const jobsCompleted = Math.floor(baseJobs * (0.5 + ratingMultiplier * 0.8));
    
    const baseCompletion = seededRandom(40, 95);
    const profileCompletion = Math.floor(baseCompletion * (0.7 + ratingMultiplier * 0.4));
    
    const responseTime = seededRandom(1, 24);
    const successRate = seededRandom(85, 99);
    const repeatCustomers = seededRandom(30, 85);
    
    return {
      experience,
      jobsCompleted,
      profileCompletion: Math.min(profileCompletion, 98),
      responseTime,
      successRate,
      repeatCustomers
    };
  };
  
  const stats = generateStats(provider.company);

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Card.Title as="h5" className="mb-0">Service Provider Profile</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src={provider.image}
              alt="Profile"
              className="rounded-circle border border-primary"
              style={{ width: '64px', height: '64px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.outerHTML = `<div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style="width: 64px; height: 64px; font-size: 1.5rem;">${getInitials(provider.company)}</div>`;
              }}
            />
            <div>
              <h5 className="mb-1">{provider.company}</h5>
              <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>{provider.title}</p>
              <div className="d-flex align-items-center gap-1">
                {renderStars(provider.rating)}
                <span className="ms-1" style={{ fontSize: '0.875rem' }}>({provider.rating})</span>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <span className="d-block" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Experience</span>
                <span className="fs-5 fw-semibold">{stats.experience} year{stats.experience !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <span className="d-block" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Jobs Completed</span>
                <span className="fs-5 fw-semibold">{stats.jobsCompleted}</span>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-6">
              <div className="bg-light p-3 rounded">
                <span className="d-block" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Location</span>
                <span className="fs-6">
                  {provider.city && provider.state
                    ? `${provider.city}, ${provider.state}`
                    : 'Location not specified'}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column gap-4">
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Profile Completion</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{stats.profileCompletion}%</span>
              </div>
              <ProgressBar now={stats.profileCompletion} variant="primary" style={{ height: '8px' }} className="mt-1" />
            </div>
            
            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="text-center p-2 border rounded">
                  <div className="fs-6 fw-bold text-success">{stats.responseTime}h</div>
                  <div style={{ fontSize: '0.75rem' }} className="text-muted">Avg Response</div>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-2 border rounded">
                  <div className="fs-6 fw-bold text-primary">{stats.successRate}%</div>
                  <div style={{ fontSize: '0.75rem' }} className="text-muted">Success Rate</div>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Repeat Customers</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{stats.repeatCustomers}%</span>
              </div>
              <ProgressBar now={stats.repeatCustomers} variant="success" style={{ height: '6px' }} />
            </div>
            
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Skills</span>
              <div className="d-flex flex-wrap gap-2 mt-2">
                <Badge bg="primary">{provider.category}</Badge>
                {getSkillsForCategory(provider.category).slice(0, 4).map((skill, index) => (
                  <Badge key={index} bg="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;