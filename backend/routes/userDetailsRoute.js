import express from 'express';
import User from '../model/User.js';
import ServiceProvider from '../model/ServiceProvider.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ POST: Create or update user details
router.post('/', verifyFirebaseToken, async (req, res) => {
  console.log('📥 Incoming user POST request:', req.body);
  try {
    const { name, email, phoneNumber = '', city = '', state = ''} = req.body;
    const firebaseUid = req.user.uid;
    console.log('Firebase UID from token:', firebaseUid);

    let existingUser = await User.findOne({ firebaseUid });
    console.log('Existing user found:', !!existingUser);

    if (existingUser) {
      existingUser.name = name;
      existingUser.email = email;
      existingUser.phoneNumber = phoneNumber;
      existingUser.city = city;
      existingUser.state = state;
      existingUser.updatedAt = new Date();

      await existingUser.save();
      console.log('User updated successfully');
      return res.status(200).json({ 
        message: 'User updated successfully!', 
        user: existingUser 
      });
    }

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const newUser = new User({
      firebaseUid,
      name,
      email,
      phoneNumber,
      city,
      state,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();
    console.log('New user created successfully', newUser);

    res.status(201).json({
      message: 'User details saved successfully!',
      user: newUser
    });

  } catch (error) {
    console.error('Error saving user details:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` 
      });
    }

    res.status(500).json({ message: 'Failed to save user details' });
  }
});



// ✅ GET: Fetch user profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    console.log('Fetching profile for UID:', firebaseUid);

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// ✅ PUT: Update user profile
router.put('/edit', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { name, email, phoneNumber, city, state, profileImage } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.email !== email) {
      const existingEmailUser = await User.findOne({ 
        email, 
        firebaseUid: { $ne: firebaseUid }
      });
      if (existingEmailUser) {
        return res.status(400).json({ message: 'Email already in use by another account.' });
      }
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber || '';
    user.city = city || '';
    user.state = state || '';
    user.profileImage = profileImage || '';
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({ 
      message: 'Profile updated successfully!', 
      user 
    });

  } catch (error) {
    console.error('Error updating user:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use.`
      });
    }

    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ✅ PUT: Update user details
router.put('/', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { name, email, phoneNumber, city, state } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber || '';
    user.city = city || 'Rohini';
    user.state = state || 'Delhi';
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({
      message: 'User details updated successfully!',
      user
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Failed to update user details' });
  }
});

// ✅ GET: Get user role
router.get('/role', verifyFirebaseToken, async (req, res) => {
  try {
    console.log('📥 Incoming /role request');
    const firebaseUid = req.user.uid;
    console.log('Firebase UID from token:', firebaseUid);
    const user = await User.findOne({ firebaseUid });
    console.log('User found:', !!user);
    if (user) return res.status(200).json({ role: 'user' });

    const provider = await ServiceProvider.findOne({ firebaseUid });
    if (provider) return res.status(200).json({ role: 'provider' });

    return res.status(404).json({ message: 'No matching user found.' });
  } catch (error) {
    console.error('Error in /role route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
