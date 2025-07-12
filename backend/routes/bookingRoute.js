import express from 'express';
import Booking from '../model/Booking.js';

const router = express.Router();

// Route to create a new booking
router.post('/', async (req, res) => {
  const { userId, serviceId, scheduledTime, serviceDetails } = req.body;

  console.log('userId:', userId);
  console.log('serviceId:', serviceId);
  
  // Validate required fields
  if (!userId || !serviceId || !scheduledTime || !serviceDetails) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newBooking = new Booking({
      userId,
      serviceId,
      scheduledTime: new Date(scheduledTime),
      serviceDetails,
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
