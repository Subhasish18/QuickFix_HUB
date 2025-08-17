import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import auth from "../../utils/Firebase";
import Footer from '../UserLandingPage/Footer';
import Navbar from '../UserLandingPage/Navbar';
import { FaUser, FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUserToBackend = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();
    await axios.post(
      "http://localhost:5000/api/user-details",
      {
        name: formData.name,
        email: formData.email,
        firebaseUid: firebaseUser.uid,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await saveUserToBackend(userCredential.user);
      toast.success("🎉 User signed up successfully!");
      navigate('/additional-details/user');
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToBackend(result.user);
      toast.success("🎉 Signed up successfully with Google!");
      navigate('/additional-details/user');
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-lg border-0" style={{ maxWidth: 400, width: "100%" }}>
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4 text-primary fw-bold">Create Your Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaUser /></span>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaEnvelope /></span>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white"><FaLock /></span>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-semibold mb-3">
                Sign Up
              </button>
            </form>
            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="mx-2 text-muted">or</span>
              <hr className="flex-grow-1" />
            </div>
            <button
              onClick={handleGoogleSignup}
              className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
              type="button"
            >
              <FaGoogle />
              Sign Up with Google
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignupUser;
