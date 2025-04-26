import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phoneNumber: { type: String },
    profileImage: { type: String },
    description: { type: String },
    pricingModel: { type: String },      // e.g., 'hourly', 'fixed'
    availability: { type: Object },     // e.g., { mon: ['9:00','17:00'], ... }
    approved: { type: Boolean, default: false },
    serviceTypes: [{ type: String }],   // e.g., ['Plumbing', 'Electrical']
    location: { type: String },
  }, { timestamps: true });
  
  // Virtual populate: services offered by provider
  providerSchema.virtual('services', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'providerId',
  });
  
  const ServiceProvider = mongoose.model('ServiceProvider', providerSchema);
export default ServiceProvider;