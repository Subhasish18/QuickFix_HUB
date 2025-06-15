import express from 'express';
import ServiceProvider from '../model/ServiceProvider.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const providers = await ServiceProvider.find()
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedProviders = providers.map(provider => ({
      id: provider._id,
      name: provider.name,
      category: provider.serviceTypes?.[0] || 'General Service',
      location: provider.location || 'Location not specified',
      profileImage: provider.profileImage || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
      rating: provider.rating || 4.5,
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
    console.error('Error fetching providers:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch providers' 
    });
  }
});

export default router;
