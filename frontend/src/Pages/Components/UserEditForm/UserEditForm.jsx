import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserEditForm = ({ show, onHide, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    state: user.state || '',
    city: user.city || ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    console.log('User prop updated:', user); // Debug log
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      state: user.state || '',
      city: user.city || ''
    });
  }, [user]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed in UserEditForm:', !!user); // Debug log
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'India' })
    })
      .then(res => res.json())
      .then(data => setStates(data.data.states.map(s => s.name)))
      .catch(() => setStates([]));
  }, []);

  useEffect(() => {
    if (!formData.state) {
      setCities([]);
      return;
    }
    fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'India', state: formData.state })
    })
      .then(res => res.json())
      .then(data => setCities(data.data))
      .catch(() => setCities([]));
  }, [formData.state]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    setErrors(newErrors);
    console.log('Form validation:', { valid: Object.keys(newErrors).length === 0, errors: newErrors }); // Debug log
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setFormData(prev => ({ ...prev, state: value, city: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const getUserInitials = () => {
    if (!formData.name) return 'U';
    return formData.name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0]?.toUpperCase() || '')
      .join('');
  };

  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser || currentUser;
    if (!user) {
      console.log('No authenticated user for token'); // Debug log
      throw new Error('User not authenticated');
    }
    const token = await user.getIdToken(true);
    console.log('Token fetched'); // Debug log
    return token;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData); // Debug log
    if (!validateForm()) {
      console.log('Validation failed'); // Debug log
      return;
    }

    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const token = await getToken();
      console.log('Sending update request with token'); // Debug log
      const response = await fetch('http://localhost:5000/api/user-details/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('Update response:', result); // Debug log
      if (!response.ok) {
        throw new Error(result.message || 'Update failed');
      }

      setSubmitSuccess('Profile updated successfully!');
      if (onSubmit) {
        console.log('Calling onSubmit with user:', result.user); // Debug log
        onSubmit(result.user);
      }

      // Delay modal close to show success message
      setTimeout(() => {
        setSubmitSuccess('');
        console.log('Closing modal'); // Debug log
        onHide();
      }, 1200);

    } catch (err) {
      console.error('Submit error:', err.message); // Debug log
      setSubmitError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {submitError && <Alert variant="danger">{submitError}</Alert>}
        {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={3}>
              <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                {getUserInitials()}
              </div>
            </Col>
            <Col md={9}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      disabled={!formData.state}
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserEditForm;