import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false 
    },
    userFirebaseUid: {
      type: String,
      required: false 
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    approved: { type: Boolean, default: true },
    isAnonymous: { type: Boolean, default: true }
  }, { timestamps: true });
  
   const Review = mongoose.model('Review', reviewSchema);
   export default Review;
