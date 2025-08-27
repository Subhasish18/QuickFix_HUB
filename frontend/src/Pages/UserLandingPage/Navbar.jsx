import { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { HashLink } from 'react-router-hash-link';
import logo from '../../assets/fix2.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [open, setOpen] = useState(false); // Dropdown state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu state
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(`https://quickfix-hub.onrender.com/api/search?q=${searchQuery}`);
      navigate('/search', { state: { results: response.data, query: searchQuery } });
      setMobileMenuOpen(false); // close menu after searching
    } catch (error) {
      console.error('Error searching for providers:', error);
    }
  };

  // Generate initials
  const getInitials = () => {
    const name = userData?.name || firebaseUser?.displayName || firebaseUser?.email;
    if (!name) return 'U';
    const parts = name.trim().split(/[\s._@]+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const getDisplayName = () => userData?.name || firebaseUser?.displayName || 'User';
  const getDisplayEmail = () => firebaseUser?.email || 'user@example.com';

  // Fetch user data
  const fetchUserData = async (firebaseToken) => {
    try {
      const roleRes = await axios.get('https://quickfix-hub.onrender.com/api/user-details/role', {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });
      const role = roleRes.data.role;
      let profileRes;
      if (role === 'provider') {
        profileRes = await axios.get('https://quickfix-hub.onrender.com/api/provider-details/profile', {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });
      } else {
        profileRes = await axios.get('https://quickfix-hub.onrender.com/api/user-details/profile', {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });
      }
      setUserData({ ...profileRes.data, role });
    } catch (err) {
      console.error('🔴 Error fetching user role/profile:', err);
      getAuth().signOut();
    }
  };

  // Auth state listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        try {
          const token = await user.getIdToken(true);
          fetchUserData(token);
        } catch (error) {
          console.error('Error fetching Firebase token:', error);
          auth.signOut();
        }
      } else {
        const adminData = JSON.parse(localStorage.getItem('userData'));
        if (adminData && adminData.role === 'admin') {
          setUserData(adminData);
          setFirebaseUser({ displayName: 'Admin', email: adminData.email });
        } else {
          setFirebaseUser(null);
          setUserData(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setOpen(false); // Close dropdown when mobile menu toggles
  };

  // Handle logout
  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
    localStorage.removeItem('userData');
    setFirebaseUser(null);
    setUserData(null);
    setMobileMenuOpen(false);
    setOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      {/* Logo & Company Name */}
      <div className="nav-logo">
        <Link to="/" className="navbar-home-link" onClick={() => setMobileMenuOpen(false)}>
          <img src={logo} alt="Logo" className="nav-logo-img" />
          <span className="nav-logo-text">QuickFixHub</span>
        </Link>
      </div>
      {/* Hamburger Icon */}
      <div className="hamburger" ref={hamburgerRef} onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>

      {/* Search Bar */}
      <div className="nav-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Provider Name, State, City, Service Type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* Links / Auth Section */}
      <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
        <HashLink smooth to="/#services" className="nav-button" onClick={() => setMobileMenuOpen(false)}>
          Browse Services
        </HashLink>
        <HashLink smooth to="/#providers" className="nav-button" onClick={() => setMobileMenuOpen(false)}>
          Service Providers
        </HashLink>

        {!firebaseUser ? (
          <>
            <button className="btn-solid" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
              Log in
            </button>
            <button className="btn-solid" onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            <div className="user-avatar" onClick={() => setOpen((prev) => !prev)}>
              {getInitials()}
            </div>
            {open && (
              <div className="user-dropdown" ref={dropdownRef} data-animate>
                <div className="dropdown-header">
                  <h3 className="user-name">{getDisplayName()}</h3>
                  <p className="user-email">{getDisplayEmail()}</p>
                </div>
                <div className="dropdown-content">
                  <div
                    className="dropdown-link"
                    onClick={() => {
                      setOpen(false);
                      setMobileMenuOpen(false);
                      if (userData?.role === 'admin') {
                        navigate('/admin');
                      } else if (userData?.role === 'provider') {
                        navigate('/hero', { state: { provider: userData } });
                      } else if (userData?.role === 'user') {
                        navigate('/userDetails');
                      } else {
                        alert('Role not identified yet. Please wait or try again.');
                      }
                    }}
                  >
                    <FiUser size={18} />
                    View Profile
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-link" onClick={handleLogout}>
                    <FiLogOut size={18} />
                    Log out
                  </div>
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