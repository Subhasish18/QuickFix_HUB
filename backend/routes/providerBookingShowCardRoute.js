import express from 'express';
import Booking from '../model/Booking.js';
import ServiceProvider from '../model/ServiceProvider.js';
import { verifyFirebaseToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// NOTE: The current Booking model links bookings directly to a ServiceProvider via `serviceId`.
// A more robust design would be to link a Booking to a specific 'Service', and the 'Service'
// to the 'ServiceProvider'. This would allow providers to offer multiple distinct services.
// This implementation works with the current model but secures the endpoint.

// SECURED: GET /api/provider-bookings - Fetch bookings for the authenticated provider
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const provider = await ServiceProvider.findOne({ firebaseUid }).select('_id city state');
    if (!provider) {
      return res.status(404).json({ message: 'Service provider profile not found.' });
    }

    const bookings = await Booking.find({ serviceId: provider._id })
      .populate('userId', 'name email phoneNumber profileImage city state') // Populate city/state from user
      .sort({ scheduledTime: -1 });

    // Attach city/state to each booking if missing
    const bookingsWithLocation = bookings.map(booking => ({
      ...booking.toObject(),
      city: booking.city || booking.userId?.city || '',
      state: booking.state || booking.userId?.state || '',
    }));

    res.status(200).json({ bookings: bookingsWithLocation });
  } catch (err) {
    console.error('Error fetching provider bookings:', err);
    res.status(500).json({ message: 'Failed to fetch provider bookings' });
  }
});

export default router;