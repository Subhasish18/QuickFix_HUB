import React from 'react';
import './Navbar.css';
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">QuickFix_HUB</div>

      <div className="nav-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search services..." />
      </div>

      <div className="nav-links">
        <a href="#">Browse Services</a>
        <a href="#">Service Providers</a>
        <button className="btn-outline">Login</button>
        <button className="btn-solid">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
