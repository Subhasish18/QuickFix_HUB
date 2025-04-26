import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: true
    },
    title:     { type: String, required: true, trim: true },
    category:  { type: String, required: true, trim: true },
    description:{ type: String },
    price:     { type: Number, required: true },
    images:    [{ type: String }],
    location:  { type: String },
  }, { timestamps: true });
  
  // Virtual populate: bookings for this service
  serviceSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'serviceId',
  });
  
  // Virtual populate: reviews for this service
  serviceSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'serviceId',
  });
  
const Service = mongoose.model('Service', serviceSchema);
export default Service;