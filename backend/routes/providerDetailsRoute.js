import express from 'express';
import ServiceProvider from '../model/ServiceProvider.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      profileImage,
      description,
      pricingModel,
      availability,
      serviceTypes,
      location,
    } = req.body;


    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const newProvider = new ServiceProvider({
      name,
      email,
      phoneNumber,
      profileImage,
      description,
      pricingModel,
      availability,
      serviceTypes,
      location,
    });

  
    await newProvider.save();

    res.status(200).json({ message: 'Provider details saved successfully!' });
  } catch (error) {
    console.error('Error saving provider details:', error.message);

 
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    res.status(500).json({ message: 'Failed to save provider details' });
  }
});




export default router;
