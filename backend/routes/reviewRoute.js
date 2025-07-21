import express from 'express';
import { verifyFirebaseToken } from '../middleware/AuthMiddleware.js';
import Review from '../model/Review.js';
import User from '../model/User.js';

const router = express.Router();


router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;
    const firebaseUid = req.user?.uid;

 
    const user = await User.findOne({ firebaseUid });
    if (!user) {
   
      return res.status(404).json({ message: 'User not found.' });
    }

    const review = new Review({
      providerId,
      rating,
      comment,
      userId: user._id,
      userFirebaseUid: firebaseUid,
    });

    await review.save();


    const populatedReview = await Review.findById(review._id).populate('userId', 'name');

    res.status(201).json(populatedReview); 
  } catch (error) {
    res.status(500).json({ message: 'Could not save review', error: error.toString() });
  }
});


router.get('/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;

    const reviews = await Review.find({ providerId })
      .sort({ createdAt: -1 }) 
      .limit(5) 
      .populate('userId', 'name');

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.toString() });
  }
});

export default router;