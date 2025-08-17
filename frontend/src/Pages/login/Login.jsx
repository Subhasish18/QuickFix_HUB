import React, { useState } from 'react';
import styled from 'styled-components';
import auth from '../../utils/Firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../UserLandingPage/Footer';
import Navbar from '../UserLandingPage/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Attempt admin login
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      if (response.data.user && response.data.user.role === 'admin') {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        toast.success('Admin login successful ✅', { toastId: 'admin-login' });
        navigate('/admin');
      } else {
        throw new Error('Not an admin.');
      }
    } catch (adminError) {
      // Step 2: Firebase login for regular users
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        const loginResponse = await axios.post('http://localhost:5000/api/login', {}, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        const userData = loginResponse.data.user;
        localStorage.setItem('userData', JSON.stringify(userData));

        if (userData.profileComplete === false) {
          toast.info('Welcome! Please complete your profile ℹ️', { toastId: 'profile-incomplete' });
          navigate('/additional-details/user');
        } else {
          toast.success('Login successful 🎉', { toastId: 'user-login' });
          navigate('/');
        }
      } catch (firebaseError) {
        let errorMessage = 'Failed to log in. Please check your credentials.';
        if (firebaseError.code) {
          switch (firebaseError.code) {
            case 'auth/user-not-found':
              errorMessage = 'No account found with this email. Please sign up.';
              break;
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              errorMessage = 'Incorrect email or password. Please try again.';
              break;
            default:
              errorMessage = 'An unexpected error occurred. Please try again.';
          }
        }
        setError(errorMessage);
        toast.error(errorMessage, { toastId: 'login-failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post('http://localhost:5000/api/login', {}, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const userData = response.data.user;
      localStorage.setItem('userData', JSON.stringify(userData));

      if (userData.profileComplete === false) {
        toast.info('Welcome! Please complete your profile ℹ️', { toastId: 'google-profile-incomplete' });
        navigate('/additional-details/user');
      } else {
        toast.success('Signed in with Google 🚀', { toastId: 'google-login' });
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message, { toastId: 'google-login-failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <StyledWrapper>
          <form onSubmit={handleLogin} className="form">
            <div className="flex-column">
              <label>Email</label>
            </div>
            <div className="inputForm">
              <input
                type="email"
                placeholder="Enter your Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex-column">
              <label>Password</label>
            </div>
            <div className="inputForm">
              <input
                type="password"
                placeholder="Enter your Password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex-row">
              <div>
                <input type="checkbox" />
                <label>Remember me</label>
              </div>
              <span className="span">Forgot password?</span>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className="button-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="p">Don't have an account? <span className="span">Sign Up</span></p>
            <p className="p line">Or With</p>

            <div className="flex-row">
              <button type="button" className="btn google" onClick={handleGoogleSignIn}>
                <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="google" width={20} />
                Google
              </button>
            </div>
          </form>
        </StyledWrapper>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Open Sans', sans-serif;
  }

  ::placeholder {
    font-family: inherit;
  }

  .form button {
    align-self: flex-end;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 100%;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: black;
    font-weight: 400;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #151717;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
  }
`;

export default Login;