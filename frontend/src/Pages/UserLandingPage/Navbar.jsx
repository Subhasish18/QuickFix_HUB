import React from 'react';
import './Navbar.css';
import { FiSearch } from 'react-icons/fi';

import { HashLink } from 'react-router-hash-link';

import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo py-2 px-3">
        <span className="fw-bold quickfix" style={{ color: '#007bff' }}>
          <Link to="/" className="navbar-home-link" style={{ color: '#007bff', textDecoration: 'none' }}>
            QuickFix
          </Link>
        </span>
        <span className="fw-semibold"><Link to="/" className="navbar-home-link" style={{ color: '#000000', textDecoration: 'none' }}>
            Hub
          </Link></span>
      </div>

      <div className="nav-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search services..." />
      </div>

      <div className="nav-links">

        <HashLink smooth to="/#services">Browse Services</HashLink>
        <HashLink smooth to="/#providers">Service Providers</HashLink>
       
       <button
          className="btn-solid"
          onClick={() => navigate('/login')}
        >
          Log in
        </button>
        <button
          className="btn-solid"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>

      </div>
    </nav>
  );
};

export default Navbar;