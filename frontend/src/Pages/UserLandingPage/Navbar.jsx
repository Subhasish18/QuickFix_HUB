import  { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { FiSearch } from 'react-icons/fi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { HashLink } from 'react-router-hash-link';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Store role and full profile if needed
  const [userData, setUserData] = useState(null);

  // Generate initials from display name or email
  const getInitials = () => {
  const name = userData?.name || firebaseUser?.displayName || firebaseUser?.email;
  if (!name) return 'U';

  const parts = name.trim().split(/[\s._@]+/); // handle names and emails
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
  };


  // Fetch role and user/provider details
  const fetchUserData = async (firebaseToken) => {
    try {
      const roleRes = await axios.get('http://localhost:5000/api/user-details/role', {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });

      const role = roleRes.data.role;
      let profileRes;

      if (role === 'provider') {
        profileRes = await axios.get('http://localhost:5000/api/provider-details/profile', {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });
      } else {
        profileRes = await axios.get('http://localhost:5000/api/user-details/profile', {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });
      }

      setUserData({ ...profileRes.data, role });
    } catch (err) {
      console.error('🔴 Error fetching user role/profile:', err);
    }
  };

  // Firebase auth state listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        fetchUserData(token);
      } else {
        setUserData(null);
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo py-2 px-3">
        <span className="fw-bold quickfix" style={{ color: '#007bff' }}>
          <Link to="/" className="navbar-home-link" style={{ textDecoration: 'none' }}>
            QuickFix
          </Link>
        </span>
        <span className="fw-semibold">
          <Link to="/" className="navbar-home-link" style={{ textDecoration: 'none' }}>
            Hub
          </Link>
        </span>
      </div>

      {/* Search Bar */}
      <div className="nav-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search services..." />
      </div>

      {/* Links / Auth Section */}
      <div className="nav-links">
        <HashLink smooth to="/#services">Browse Services</HashLink>
        <HashLink smooth to="/#providers">Service Providers</HashLink>

        {!firebaseUser ? (
          <>
            <button className="btn-solid" onClick={() => navigate('/login')}>Log in</button>
            <button className="btn-solid" onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        ) : (
          <>
            {/* Avatar */}
            <div className="user-avatar" onClick={() => setOpen(prev => !prev)}>
              {getInitials()}
            </div>


            {/* Dropdown */}
            {open && (
              <div className="user-dropdown" ref={dropdownRef}>
                <div className="dropdown-header">
                  <strong>{firebaseUser.displayName || 'User'}</strong>
                  <span>{firebaseUser.email}</span>
                </div>

                <div className="dropdown-link" onClick={() => {
                  setOpen(false);
                  if (userData?.role === 'user') {
                    navigate('/userDetails');
                  } else if (userData?.role === 'provider') {
                    navigate('/hero', { state: { provider: userData } });
                  } else {
                    alert("Role not identified.");
                  }
                }}>
                  View Profile
                </div>

                <div className="dropdown-link">Settings</div>
                <div className="dropdown-divider" />
                <div className="dropdown-link" onClick={() => {
                  const auth = getAuth();
                  auth.signOut().then(() => {
                    setFirebaseUser(null);
                    setUserData(null);
                    navigate('/');
                  });
                }}>
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
