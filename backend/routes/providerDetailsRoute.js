import express from 'express';
import ServiceProvider from '../model/ServiceProvider.js';
import { verifyFirebaseToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// ✅ POST: Create or update provider profile
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    console.log('📥 Incoming provider POST request');
    const {
      name,
      email,
      phoneNumber = '',
      profileImage = '',
      description = '',
      pricingModel = '',
      availability = {},
      serviceTypes = [],
      city = 'Rohini',
      state = 'Delhi',
    } = req.body;

    const firebaseUid = req.user.uid;
    console.log('Firebase UID:', firebaseUid);

    let existingProvider = await ServiceProvider.findOne({ firebaseUid });
    if (existingProvider) {
      existingProvider.name = name;
      existingProvider.email = email;
      existingProvider.phoneNumber = phoneNumber;
      existingProvider.profileImage = profileImage;
      existingProvider.description = description;
      existingProvider.pricingModel = pricingModel;
      existingProvider.availability = availability;
      existingProvider.serviceTypes = serviceTypes;
      existingProvider.city = city;
      existingProvider.state = state;
      existingProvider.updatedAt = new Date();

      await existingProvider.save();
      console.log('✅ Provider updated');
      return res.status(200).json({ message: 'Provider updated successfully!', provider: existingProvider });
    }

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const newProvider = new ServiceProvider({
      firebaseUid,
      name,
      email,
      phoneNumber,
      profileImage,
      description,
      pricingModel,
      availability,
      serviceTypes,
      city,
      state,
    });

    await newProvider.save();
    console.log('✅ New provider created');
    res.status(201).json({ message: 'Provider details saved successfully!', provider: newProvider });
  } catch (error) {
    console.error('❌ Error in POST /provider-details:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
    }
    res.status(500).json({ message: 'Failed to save provider details' });
  }
});

// ✅ GET: Fetch provider profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    console.log('📤 Fetching profile for UID:', firebaseUid);

    const provider = await ServiceProvider.findOne({ firebaseUid });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.status(200).json(provider);
  } catch (error) {
    console.error('❌ Error fetching provider profile:', error);
    res.status(500).json({ message: 'Failed to fetch provider profile' });
  }
});

// ✅ PUT: Edit provider profile
router.put('/edit', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const {
      name,
      email,
      phoneNumber = '',
      profileImage = '',
      description = '',
      pricingModel = '',
      availability = {},
      serviceTypes = [],
      city = 'Rohini',
      state = 'Delhi',
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const provider = await ServiceProvider.findOne({ firebaseUid });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    if (provider.email !== email) {
      const existing = await ServiceProvider.findOne({ email, firebaseUid: { $ne: firebaseUid } });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use by another account.' });
      }
    }

    provider.name = name;
    provider.email = email;
    provider.phoneNumber = phoneNumber;
    provider.profileImage = profileImage;
    provider.description = description;
    provider.pricingModel = pricingModel;
    provider.availability = availability;
    provider.serviceTypes = serviceTypes;
    provider.city = city;
    provider.state = state;
    provider.updatedAt = new Date();

    await provider.save();

    res.status(200).json({ message: 'Profile updated successfully!', provider });
  } catch (error) {
    console.error('❌ Error updating provider:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use.`
      });
    }

    res.status(500).json({ message: 'Failed to update profile' });
  }
});
router.put('/', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const {
      name,
      email,
      phoneNumber = '',
      profileImage = '',
      description = '',
      pricingModel = '',
      availability = {},
      serviceTypes = [],
      city = 'Rohini',
      state = 'Delhi',
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const provider = await ServiceProvider.findOne({ firebaseUid });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.name = name;
    provider.email = email;
    provider.phoneNumber = phoneNumber;
    provider.profileImage = profileImage;
    provider.description = description;
    provider.pricingModel = pricingModel;
    provider.availability = availability;
    provider.serviceTypes = serviceTypes;
    provider.city = city;
    provider.state = state;
    provider.updatedAt = new Date();

    await provider.save();

    res.status(200).json({ message: 'Provider details updated successfully!', provider });
  } catch (error) {
    console.error('❌ Error updating provider:', error);
    res.status(500).json({ message: 'Failed to update provider details' });
  }
});

export default router;
