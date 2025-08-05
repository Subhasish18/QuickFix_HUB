import express from 'express';
import ServiceProvider from '../model/ServiceProvider.js';

const router = express.Router();

// GET /api/providers - Fetch recent service providers
router.get('/', async (req, res) => {
  try {
    // Fetch latest 20 providers sorted by creation date (newest first)
    const providers = await ServiceProvider.find()
      .sort({ createdAt: -1 })
      .limit(20);

    // Format each provider into a client-friendly structure
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

    // Send the formatted result as a success response
    res.status(200).json(formattedProviders);
  } catch (error) {
    // Log error details for server-side debugging
    console.error('Error fetching providers:', error.message, error.stack);

    // Send a generic server error response
    res.status(500).json({
      success: false,
      message: 'Failed to fetch providers'
    });
  }
});

export default router;
