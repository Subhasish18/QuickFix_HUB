import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating:  { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    approved: { type: Boolean, default: false }
  }, { timestamps: true });
  
   const Review = mongoose.model('Review', reviewSchema);
   export default Review;