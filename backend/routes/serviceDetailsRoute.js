import express from 'express';
import ServiceProvider from '../model/ServiceProvider.js';

const router = express.Router();

// Get providers by service name (case-insensitive)
console.log('ServiceDetails route initialized');
router.get('/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;
    console.log(`Fetching providers for service: ${serviceName} `);
    // Find providers where serviceTypes array contains the serviceName (case-insensitive)
    const providers = await ServiceProvider.find({
      serviceTypes: { $regex: new RegExp(serviceName, 'i') }
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch providers' });
  }
});

export default router;