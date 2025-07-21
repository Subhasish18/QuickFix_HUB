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

// Update booking status
router.put('/:bookingId/status', async (req, res) => {
  const { bookingId } = req.params;
  const { status, paymentStatus, confirmedAt } = req.body;

  const update = {};
  if (status) update.status = status;
  if (paymentStatus) update.paymentStatus = paymentStatus;
  if (confirmedAt) update.confirmedAt = confirmedAt;

  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      update,
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking' });
  }
});

export default router;
