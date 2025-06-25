// routes/isServiceProviderRoute.js

import express from 'express';
import ServiceProvider from '../model/ServiceProvider.js'; // Adjust the path if needed

const router = express.Router();

// GET /api/is-service-provider?email=user@example.com
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const provider = await ServiceProvider.findOne({ email });
    res.json({ isServiceProvider: !!provider });
  } catch (err) {
    console.error('Error checking provider status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
