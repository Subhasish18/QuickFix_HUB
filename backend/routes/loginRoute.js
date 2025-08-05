import express from 'express';
import User from '../model/User.js';
import ServiceProvider from '../model/ServiceProvider.js';
import admin from '../firebase.js';

const router = express.Router();

// Login route for Firebase Auth
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
   
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      
      return res.status(200).json({
        message: 'Admin login successful',
        user: {
          email: email,
          role: 'admin',
        },
      });
    }

    // If not admin, proceed with Firebase authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const idToken = authHeader.split(' ')[1];

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Find the user or service provider in your database
    const user = await User.findOne({ email: decodedToken.email });
    const serviceProvider = await ServiceProvider.findOne({ email: decodedToken.email });

    if (!user && !serviceProvider) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    // Respond with user or service provider info
    if (user) {
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'user',
          // Add other fields as needed
        },
      });
    } else {
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: serviceProvider._id,
          name: serviceProvider.name,
          email: serviceProvider.email,
          role: 'provider',
          // Add other fields as needed
        },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router;