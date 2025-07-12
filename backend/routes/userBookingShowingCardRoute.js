import express from 'express';
import Booking from '../model/Booking.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  try {
    console.log('Fetching bookings for user:', req.params.userId);
    const bookings = await Booking.find({ userId: req.params.userId })
       .populate('serviceId');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

export default router;