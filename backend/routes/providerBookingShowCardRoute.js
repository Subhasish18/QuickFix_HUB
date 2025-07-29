import express from 'express';
import Booking from '../model/Booking.js';

const router = express.Router();

// GET /api/provider-bookings/provider/:providerId
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    // Populate both userId (for user name) and serviceId (for provider location)
    const bookings = await Booking.find({ serviceId: providerId })
      .populate([
        { path: 'userId', select: 'name email location' },
        { path: 'serviceId', select: 'location name' }
      ]);
  
    res.json({ bookings });
  } catch (err) {
    console.error('Error fetching provider bookings:', err);
    res.status(500).json({ message: 'Failed to fetch provider bookings' });
  }
});

export default router;