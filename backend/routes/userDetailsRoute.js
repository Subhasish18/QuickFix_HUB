import express from 'express';
import User from '../model/User.js'; // Import the updated User model

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phoneNumber, location } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      phoneNumber,
      location,
    });
  
    // Save the user to the database
    await newUser.save();
  
    res.status(200).json({ message: 'User details saved successfully!' });
   
  } catch (error) {
    console.error('Error saving user details:', error.message);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    res.status(500).json({ message: 'Failed to save user details' });
  }
});

export default router;