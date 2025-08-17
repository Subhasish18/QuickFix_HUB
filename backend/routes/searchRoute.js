
import express from 'express';
import ServiceProvider from '../model/ServiceProvider.js';

const router = express.Router();

// GET /api/search?q=<query>
router.get('/', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const regex = new RegExp(q, 'i'); // Case-insensitive regex

    const providers = await ServiceProvider.find({
      $or: [
        { name: regex },
        { serviceTypes: regex },
        { city: regex },
        { state: regex },
      ],
    });

    // Important: Log the number of providers found for a given query.
    console.log(`Found ${providers.length} providers for query: "${q}"`);

    const formattedProviders = providers.map(provider => ({
        id: provider._id,
        name: provider.name,
        category: provider.serviceTypes?.[0] || 'General Service',
        location: (provider.city && provider.state)
          ? `${provider.city}, ${provider.state}`
          : 'Location not specified',
        profileImage: provider.profileImage || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
        rating: provider.rating || 4.5, // Static fallback rating
        description: provider.description || 'Professional service provider',
        pricingModel: provider.pricingModel || 'Contact for pricing',
        isProvider: true,
        services: [{
          title: `${provider.serviceTypes?.[0] || 'General'} Services`,
          price: provider.pricingModel || 'Contact for pricing'
        }]
      }));
  
      res.status(200).json(formattedProviders);
  } catch (error) {
    console.error('Error searching for providers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
