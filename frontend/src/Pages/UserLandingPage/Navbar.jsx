import React from 'react';
import './Navbar.css';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">QuickFix_HUB</div>

      <div className="nav-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search services..." />
      </div>

      <div className="nav-links">
        <HashLink smooth to="/#services">Browse Services</HashLink>
        <HashLink smooth to="/#providers">Service Providers</HashLink>
        <Link to="/login" className="btn-outline">Login</Link>
        <Link to="/signup" className="btn-solid">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
