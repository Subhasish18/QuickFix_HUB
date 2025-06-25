import { useState } from 'react';
import EditProviderModal from './EditProviderModal';
import { Card, Badge, ProgressBar, Button } from 'react-bootstrap';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileCard = ({ provider, onProviderUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: provider?.name || '',
    email: provider?.email || '',
    phoneNumber: provider?.phoneNumber || '',
    description: provider?.description || '',
    location: provider?.location || '',
    pricingModel: provider?.pricingModel || '',
    serviceTypes: provider?.serviceTypes || [],
    availability: provider?.availability
      ? JSON.stringify(provider.availability, null, 2)
      : '{}',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!provider) {
    return (
      <Card className="shadow-sm">
        <Card.Header>
          <Card.Title as="h5" className="mb-0">Service Provider Profile</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="text-center py-4">
            <p className="text-muted">Loading provider information...</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

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
    if (!name) return 'SP';
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const calculateProfileCompletion = () => {
    const fields = [
      provider.name,
      provider.email,
      provider.phoneNumber,
      provider.description,
      provider.location,
      provider.serviceTypes?.length > 0,
      provider.pricingModel
    ];
    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const handleEditClick = () => {
    setEditData({
      name: provider.name || '',
      email: provider.email || '',
      phoneNumber: provider.phoneNumber || '',
      description: provider.description || '',
      location: provider.location || '',
      pricingModel: provider.pricingModel || '',
      serviceTypes: provider.serviceTypes || [],
      availability: provider.availability
        ? JSON.stringify(provider.availability, null, 2)
        : '{}',
    });
    setShowEditModal(true);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceTypesChange = (e) => {
    const value = e.target.value;
    const serviceTypesArray = value
      .split(',')
      .map(service => service.trim())
      .filter(service => service !== '');
    setEditData(prev => ({
      ...prev,
      serviceTypes: serviceTypesArray
    }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const token = await user.getIdToken();

      let availabilityObj = {};
      try {
        availabilityObj = JSON.parse(editData.availability);
      } catch {
        throw new Error('Availability must be valid JSON');
      }

      const payload = {
        name: editData.name,
        email: editData.email,
        phoneNumber: editData.phoneNumber,
        description: editData.description,
        location: editData.location,
        pricingModel: editData.pricingModel,
        serviceTypes: editData.serviceTypes,
        availability: availabilityObj
      };

      const response = await axios.put(
        'http://localhost:5000/api/provider-details/edit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Profile updated successfully!');
      if (onProviderUpdate) onProviderUpdate(response.data.provider);

      setTimeout(() => {
        setShowEditModal(false);
        setSuccess('');
      }, 1500);

    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      setError(
        error.response?.data?.message || error.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title as="h5" className="mb-0">Service Provider Profile</Card.Title>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={handleEditClick}
            className="d-flex align-items-center gap-1"
          >
            <i className="bi bi-pencil"></i>
            Edit
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                {getInitials(provider.name)}
              </div>
              <div>
                <h5 className="mb-1">{provider.name}</h5>
                <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                  {provider.serviceTypes?.[0] ? `Professional ${provider.serviceTypes[0]}` : 'Service Provider'}
                </p>
                <div className="d-flex align-items-center gap-1">
                  {renderStars(provider.rating || 0)}
                  <span className="ms-1" style={{ fontSize: '0.875rem' }}>
                    ({provider.rating?.toFixed(1) || '0.0'})
                  </span>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <div className="bg-light p-3 rounded">
                  <span className="d-block fw-medium text-muted">Email</span>
                  <span className="fs-6">{provider.email}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light p-3 rounded">
                  <span className="d-block fw-medium text-muted">Phone</span>
                  <span className="fs-6">{provider.phoneNumber || 'N/A'}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light p-3 rounded">
                  <span className="d-block fw-medium text-muted">Pricing Model</span>
                  <span className="fs-6">{provider.pricingModel || 'N/A'}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light p-3 rounded">
                  <span className="d-block fw-medium text-muted">Availability</span>
                  <span className="fs-6">
                    {provider.availability && Object.keys(provider.availability).length > 0 ? 'Available' : 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-4">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-medium text-muted">Profile Completion</span>
                  <span className="fw-medium text-muted">{profileCompletion}%</span>
                </div>
                <ProgressBar now={profileCompletion} variant="primary" style={{ height: '8px' }} className="mt-1" />
              </div>
              <div>
                <span className="fw-medium text-muted">Services</span>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {provider.serviceTypes?.length > 0 ? (
                    provider.serviceTypes.map((service, index) => (
                      <Badge key={index} bg="secondary">{service}</Badge>
                    ))
                  ) : (
                    <Badge bg="light" text="dark">No services specified</Badge>
                  )}
                </div>
              </div>
              {provider.location && (
                <div>
                  <span className="fw-medium text-muted">Location</span>
                  <p className="mb-0 mt-1">
                    <i className="bi bi-geo-alt me-1"></i>
                    {provider.location}
                  </p>
                </div>
              )}
              {provider.description && (
                <div>
                  <span className="fw-medium text-muted">About</span>
                  <p className="mb-0 mt-1">{provider.description}</p>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <EditProviderModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        editData={editData}
        onChange={handleInputChange}
        onServiceTypesChange={handleServiceTypesChange}
        onSubmit={handleSaveChanges}
        error={error}
        success={success}
        isLoading={isLoading}
      />
    </>
  );
};

export default ProfileCard;
