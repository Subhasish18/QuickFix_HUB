import express from 'express';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import Review from '../model/Review.js';
import User from '../model/User.js';

const router = express.Router();


router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;
    const firebaseUid = req.user?.uid;

    console.log('[Review API] POST request received:');
    console.log('  - Provider ID:', providerId, 'Type:', typeof providerId);
    console.log('  - Rating:', rating, 'Type:', typeof rating);
    console.log('  - Comment:', comment);
    console.log('  - Firebase UID:', firebaseUid);

    // Validate required fields
    if (!providerId) {
      console.log('[Review API] Error: Provider ID is missing');
      return res.status(400).json({ message: 'Provider ID is required' });
    }
    if (!rating || rating < 1 || rating > 5) {
      console.log('[Review API] Error: Invalid rating:', rating);
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (!comment || !comment.trim()) {
      console.log('[Review API] Error: Comment is missing or empty');
      return res.status(400).json({ message: 'Comment is required' });
    }
 
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      console.log('[Review API] Error: User not found for Firebase UID:', firebaseUid);
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log('[Review API] User found:', user.name, 'ID:', user._id);

    const review = new Review({
      providerId,
      rating,
      comment,
      userId: user._id,
      userFirebaseUid: firebaseUid,
    });

    console.log('[Review API] Attempting to save review:', review);
    await review.save();
    console.log('[Review API] Review saved successfully with ID:', review._id);

    const populatedReview = await Review.findById(review._id).populate('userId', 'name');
    console.log('[Review API] Populated review:', populatedReview);

    res.status(201).json(populatedReview); 
  } catch (error) {
    console.error('[Review API] Error saving review:', error);
    console.error('[Review API] Error stack:', error.stack);
    res.status(500).json({ message: 'Could not save review', error: error.toString() });
  }
});


router.get('/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;

    console.log('[Review API] GET request for provider:', providerId, 'Type:', typeof providerId);

    const reviews = await Review.find({ providerId })
      .sort({ createdAt: -1 }) 
      .limit(5) 
      .populate('userId', 'name');

    console.log(`[Review API] Found ${reviews.length} reviews for provider ${providerId}`);
    if (reviews.length > 0) {
      console.log('[Review API] Sample review:', reviews[0]);
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('[Review API] Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.toString() });
  }
});

export default router;