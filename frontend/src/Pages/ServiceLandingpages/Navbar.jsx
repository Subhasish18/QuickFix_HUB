import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Offcanvas, Button, Dropdown, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavbarComponent = () => {
  const [notifications] = useState(3);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  return (
    <Navbar sticky="top" bg="light" expand="md" className="border-bottom py-2">
      <div className="container">
        <Navbar.Brand as={Link} to="/">
          <span className="fw-bold quickfix" style={{ color: '#007bff' }}>QuickFix</span>
          <span className="fw-semibold">Hub</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
          show={showOffcanvas}
          onHide={handleClose}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">
              <Link to="/" className="text-decoration-none">
                <span className="fw-bold quickfix" style={{ color: '#007bff' }}>QuickFix</span>
                <span className="fw-semibold">Hub</span>
              </Link>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column flex-md-row align-items-md-center">
              <Nav.Link as={Link} to="/" onClick={handleClose}>Home</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        <div className="d-flex align-items-center ms-auto gap-2">          
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="dropdown-profile"
              className="p-0"
              style={{ textDecoration: 'none' }}
            >
              <img
                src="https://github.com/shadcn.png"
                alt="Profile"
                className="rounded-circle"
                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.outerHTML = `<div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-size: 0.875rem;">FD</div>`;
                }}
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>
                <div>
                  <div className="fw-medium">Farebi Dalle</div>
                  <small className="text-muted">daleshwar@example.com</small>
                </div>
              </Dropdown.Header>
            
              <Dropdown.Item>Log out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
};

export default NavbarComponent;