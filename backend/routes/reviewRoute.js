import express from 'express';
import { verifyFirebaseToken } from '../middleware/AuthMiddleware.js';
import Review from '../model/Review.js';

const router = express.Router();


router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;
    const userId = req.user?.uid; 
    
    const review = new Review({
      providerId,
      rating,
      comment,
      userId,
      userFirebaseUid: req.user.uid,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Could not save review', error: error.toString() });
  }
});

export default router;