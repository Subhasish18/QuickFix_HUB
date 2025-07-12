import express from 'express';
import Booking from '../model/Booking.js';

const router = express.Router();

// GET /api/provider-bookings/provider/:providerId
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const bookings = await Booking.find({ serviceId: providerId })
      .populate('userId', 'name email');
    res.json({ bookings });
  } catch (err) {
    console.error('Error fetching provider bookings:', err);
    res.status(500).json({ message: 'Failed to fetch provider bookings' });
  }
});

export default router;