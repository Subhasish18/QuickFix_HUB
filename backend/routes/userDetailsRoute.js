import express from 'express';
import User from '../model/User.js';
import ServiceProvider from '../model/ServiceProvider.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js'; // Ensure this middleware is correctly set up


const router = express.Router();

// FIXED: POST route for creating/updating user details
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { name, email, phoneNumber, location } = req.body;

    // Get UID from decoded Firebase token (set by middleware)
    const firebaseUid = req.user.uid;
    console.log('Firebase UID from token:', firebaseUid); // ADDED: Debug logging

    // Check if user already exists (prevent duplicates)
    let existingUser = await User.findOne({ firebaseUid });
    console.log('Existing user found:', !!existingUser); // ADDED: Debug logging

    if (existingUser) {
      // Update the existing user instead of creating new one
      existingUser.name = name;
      existingUser.email = email;
      existingUser.phoneNumber = phoneNumber;
      existingUser.location = location;
      // Only update role if explicitly provided and user is admin
      if (role && ['user'].includes(role)) {
        existingUser.role = role;
      }
      existingUser.updatedAt = new Date(); // ADDED: Track update time

      await existingUser.save();
      console.log('User updated successfully'); // ADDED: Success logging
      return res.status(200).json({ 
        message: 'User updated successfully!', 
        user: existingUser // ADDED: Return updated user data
      });
    }

    // Validate required fields before creating new user
    if (!name || !email) {
      console.log('Validation failed: Missing name or email'); // ADDED: Error logging
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Create new user with Firebase UID and default role
    const newUser = new User({
      firebaseUid, // Link Firebase UID to database record
      name,
      email,
      phoneNumber,
      location,
      // role will automatically default to 'user' from schema
      createdAt: new Date(), // ADDED: Track creation time
      updatedAt: new Date()  // ADDED: Track update time
    });
  
    // Save the user to the database
    await newUser.save();
    console.log('New user created successfully',newUser); // ADDED: Success logging
  
    res.status(201).json({ // CHANGED: 201 for resource creation
      message: 'User details saved successfully!',
      user: newUser // ADDED: Return created user data
    });
   
  } catch (error) {
    console.error('Error saving user details:', error.message);
    console.error('Full error:', error); // ADDED: More detailed error logging

    // Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]; // ADDED: Get specific duplicate field
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` 
      });
    }

    // Generic error response
    res.status(500).json({ message: 'Failed to save user details' });
  }
});

// FIXED: GET /api/users/profile - fetch current user's profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid; // Extract UID from verified Firebase token
    console.log('Fetching profile for UID:', firebaseUid); // ADDED: Debug logging

    // Find user in database by Firebase UID
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      console.log('User not found in database'); // ADDED: Error logging
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User profile fetched successfully'); // ADDED: Success logging
    res.status(200).json(user); // Send user data to frontend
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    console.error('Full error:', error); // ADDED: More detailed error logging
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// FIXED: PUT /api/users/edit - Update the authenticated user's profile
router.put('/edit', verifyFirebaseToken, async (req, res) => {
  try {
    // Extract the Firebase UID from the decoded token (set by middleware)
    const firebaseUid = req.user.uid;
    console.log('Updating profile for UID:', firebaseUid); // ADDED: Debug logging

    // Destructure the incoming user data from the request body
    const { name, email, phoneNumber, location, profileImage } = req.body;
    console.log('Update data received:', { name, email, phoneNumber, location, hasImage: !!profileImage }); // ADDED: Debug logging

    // Validate required fields
    if (!name || !email) {
      console.log('Validation failed: Missing required fields'); // ADDED: Error logging
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // ADDED: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format'); // ADDED: Error logging
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Find the user by Firebase UID
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      console.log('User not found for update'); // ADDED: Error logging
      return res.status(404).json({ message: 'User not found' });
    }

    // ADDED: Check if email is being changed and if new email already exists
    if (user.email !== email) {
      const existingEmailUser = await User.findOne({ 
        email, 
        firebaseUid: { $ne: firebaseUid } // Exclude current user
      });
      
      if (existingEmailUser) {
        console.log('Email already in use by another user'); // ADDED: Error logging
        return res.status(400).json({ message: 'Email already in use by another account.' });
      }
    }

    // Update user's fields
    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber || ''; // ADDED: Handle empty strings
    user.location = location || ''; // ADDED: Handle empty strings
    user.profileImage = profileImage || ''; // ADDED: Handle empty strings
    
    user.updatedAt = new Date(); // ADDED: Track update timestamp

    // Save the updated user in the database
    await user.save();
    console.log('User profile updated successfully'); // ADDED: Success logging

    // Respond with success message and updated user data
    res.status(200).json({ 
      message: 'Profile updated successfully!', 
      user: {
        // ADDED: Return sanitized user data (exclude sensitive fields if any)
        _id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        profileImage: user.profileImage,
        role: user.role, // Include role in response
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating user:', error.message);
    console.error('Full error:', error); // ADDED: More detailed error logging

    // Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]; // ADDED: Get specific duplicate field
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use.` 
      });
    }

    // Fallback for other errors
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ✅ Get role based on Firebase UID
router.get('/role', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    // First check if user is a regular user
    const user = await User.findOne({ firebaseUid });
    if (user) return res.status(200).json({ role: 'user' });

    // Then check if user is a service provider
    const provider = await ServiceProvider.findOne({ firebaseUid });
    if (provider) return res.status(200).json({ role: 'provider' });

    return res.status(404).json({ message: 'No matching user found.' });
  } catch (error) {
    console.error('Error in /role route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


export default router;