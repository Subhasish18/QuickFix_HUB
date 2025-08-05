import express from 'express';
import User from '../model/User.js';
import ServiceProvider from '../model/ServiceProvider.js';
import Booking from '../model/Booking.js';

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Get all providers
router.get('/providers', async (req, res) => {
  try {
    const providers = await ServiceProvider.find();
    res.json({ providers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch providers' });
  }
});

// Get provider by ID
router.get('/providers/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json({ provider });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch provider' });
  }
});

// Delete provider by ID
router.delete('/providers/:id', async (req, res) => {
  try {
    await ServiceProvider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Provider deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete provider' });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate([
        { path: 'userId', select: 'name email' },
        { path: 'serviceId', select: 'name location' }
      ]);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

export default router;