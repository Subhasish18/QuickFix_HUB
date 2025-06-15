import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Utility to generate initials
  const getInitials = (user) => {
    if (!user) return 'U';

    if (user.displayName && typeof user.displayName === 'string') {
      const nameParts = user.displayName.trim().split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }

    if (user.email) {
      const emailName = user.email.split('@')[0]; // "john.doe"
      const emailParts = emailName.split(/[._]/); // split on . or _
      if (emailParts.length >= 2) {
        return (emailParts[0][0] + emailParts[1][0]).toUpperCase();
      }
      return emailParts[0][0].toUpperCase();
    }

    return 'U';
  };

  // Detect auth state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">QuickFix_HUB</div>

      {/* Search */}
      <div className="nav-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search services..." />
      </div>

      {/* Right nav */}
      <div className="nav-links">
        <a href="#">Browse Services</a>
        <a href="#">Service Providers</a>

        {!user ? (
          <>
            <button className="btn-outline">Login</button>
            <button className="btn-solid">Sign Up</button>
          </>
        ) : (
          <>
            {/* Avatar */}
            <div
              className="user-avatar"
              onClick={() => setOpen(prev => !prev)}
            >
              {getInitials(user)}
            </div>

            {/* Dropdown */}
            {open && (
              <div className="user-dropdown" ref={dropdownRef}>
                <div className="dropdown-header">
                  <strong>{user.displayName || 'User'}</strong>
                  <span>{user.email}</span>
                </div>

                <div
                  className="dropdown-link"
                  onClick={() => {
                    setOpen(false);
                    navigate('/userDetails');
                  }}
                >
                  View Profile
                </div>
                <div className="dropdown-link">Settings</div>

                <div className="dropdown-divider" />

                <div
                  className="dropdown-link"
                  onClick={() => {
                    const auth = getAuth();
                    auth.signOut().then(() => {
                      setUser(null);
                      navigate('/');
                    });
                  }}
                >
                  Log out
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
