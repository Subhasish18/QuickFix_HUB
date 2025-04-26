// src/SignupUser.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../../utils/Firebase";  // <-- fixed this line
import axios from "axios";




const SignupUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    location: '',
    profileImage: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      await axios.post('http://localhost:5000/api/signup-user', {
        ...formData,
        uid: firebaseUser.uid
      });

      alert('User signed up successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">User Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">
        {['name', 'email', 'password', 'phoneNumber', 'location', 'profileImage'].map((field) => (
          <input
            key={field}
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border p-2 rounded"
            onChange={handleChange}
            value={formData[field]}
            required
          />
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupUser;
