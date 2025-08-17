import { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { FiSearch } from 'react-icons/fi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { HashLink } from 'react-router-hash-link';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Navbar = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // This state will hold data for any logged-in user (Firebase user, provider, or admin)
  const [userData, setUserData] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/search?q=${searchQuery}`);
      navigate('/search', { state: { results: response.data, query: searchQuery } });
    } catch (error) {
      console.error('Error searching for providers:', error);
    }
  };

  // Generate initials from display name or email
  const getInitials = () => {
    const name = userData?.name || firebaseUser?.displayName || firebaseUser?.email;
    if (!name) return 'U';

    const parts = name.trim().split(/[\s._@]+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  // Fetch role and profile for Firebase-authenticated users
  const fetchUserData = async (firebaseToken) => {
    try {
      // The backend /role route determines if the UID belongs to a user or provider
      const roleRes = await axios.get('http://localhost:5000/api/user-details/role', {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });

      const role = roleRes.data.role;
      let profileRes;

      if (role === 'provider') {
        profileRes = await axios.get('http://localhost:5000/api/provider-details/profile', {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });
      } else { // 'user' role
        profileRes = await axios.get('http://localhost:5000/api/user-details/profile', {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });
      }

      // Set the combined user data (profile + role)
      setUserData({ ...profileRes.data, role });

    } catch (err) {
      console.error('🔴 Error fetching user role/profile:', err);
      // If fetching data fails, it might be due to an invalid token, so sign out.
      getAuth().signOut();
    }
  };

  // Combined auth state listener for Firebase and Admin
  useEffect(() => {
    const auth = getAuth();

    // This listener handles Firebase user state changes (user/provider)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // A Firebase user is signed in.
        setFirebaseUser(user);
        try {
          const token = await user.getIdToken(true); // Force refresh token
          fetchUserData(token);
        } catch (error) {
          console.error("Error fetching Firebase token:", error);
          auth.signOut(); // Sign out if token is invalid
        }
      } else {
        // No Firebase user is signed in. Check for a manually logged-in admin.
        const adminData = JSON.parse(localStorage.getItem('userData'));
        if (adminData && adminData.role === 'admin') {
          setUserData(adminData);
          // Create a mock firebaseUser for display purposes (e.g., showing email)
          setFirebaseUser({ displayName: 'Admin', email: adminData.email });
        } else {
          // No one is logged in. Clear all user state.
          setFirebaseUser(null);
          setUserData(null);
        }
      }
    });

    // Cleanup listener on component unmount
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

  const handleLogout = () => {
    const auth = getAuth();
    // Sign out from Firebase. This will trigger onAuthStateChanged, clearing Firebase state.
    auth.signOut();
    // Manually clear admin data from local storage.
    localStorage.removeItem('userData');
    // Immediately clear state for a faster UI response.
    setFirebaseUser(null);
    setUserData(null);
    // Navigate to the home page.
    navigate('/');
  };


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
        <input
          type="text"
          placeholder="Provider Name, State, City, service Type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
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
                  <strong>{userData?.name || firebaseUser.displayName || 'User'}</strong>
                  <span>{firebaseUser.email}</span>
                </div>

                <div className="dropdown-link" onClick={() => {
                  setOpen(false);
                  if (userData?.role === 'admin') {
                    navigate('/admin');
                  } else if (userData?.role === 'provider') {
                    navigate('/hero', { state: { provider: userData } });
                  } else if (userData?.role === 'user') {
                    navigate('/userDetails');
                  } else {
                    // Fallback or loading state
                    alert("Role not identified yet. Please wait or try again.");
                  }
                }}>
                  View Profile
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-link" onClick={handleLogout}>
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
