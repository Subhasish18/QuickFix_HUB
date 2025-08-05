import express from 'express';
import ServiceProvider from '../model/ServiceProvider.js';

const router = express.Router();

// Get providers by service name (case-insensitive)
console.log('ServiceDetails route initialized');
router.get('/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const { city, state } = req.query; // Optional query params for location filtering

    console.log(`Fetching providers for service: ${serviceName}`);

    // Build search filter
    const filter = {
      serviceTypes: { $regex: new RegExp(serviceName, 'i') }
    };

    // Add city/state filters if provided
    if (city) filter.city = city;
    if (state) filter.state = state;

    const providers = await ServiceProvider.find(filter);

    res.json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ message: 'Failed to fetch providers' });
  }
});

export default router;
