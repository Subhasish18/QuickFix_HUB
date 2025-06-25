import { Modal, Form, Row, Col, Alert, Button } from 'react-bootstrap';

const EditProviderModal = ({
  show,
  onHide,
  editData,
  onChange,
  onServiceTypesChange,
  onSubmit,
  error,
  success,
  isLoading
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Provider Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={onChange}
                  required
                  className="bg-light"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={onChange}
                  required
                  className="bg-light"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={editData.phoneNumber}
                  onChange={onChange}
                  className="bg-light"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={editData.location}
                  onChange={onChange}
                  className="bg-light"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>About/Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={editData.description}
              onChange={onChange}
              className="bg-light"
              placeholder="Tell us about your services and experience..."
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Service Types</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.serviceTypes.join(', ')}
                  onChange={onServiceTypesChange}
                  className="bg-light"
                  placeholder="e.g., Plumbing, Electrical, Carpentry"
                />
                <Form.Text className="text-muted">
                  Separate multiple services with commas
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Pricing Model</Form.Label>
                <Form.Select
                  name="pricingModel"
                  value={editData.pricingModel}
                  onChange={onChange}
                  className="bg-light"
                >
                  <option value="">Select pricing model</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="negotiable">Negotiable</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Availability</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="availability"
              value={JSON.stringify(editData.availability || {}, null, 2)}
              onChange={onChange}
              className="bg-light"
              placeholder='e.g., { "mon": ["9:00", "17:00"], "tue": ["10:00", "16:00"] }'
            />
            <Form.Text className="text-muted">
              Enter availability in JSON format. For advanced input, customize form structure.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isLoading || !editData.name || !editData.email}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProviderModal;
