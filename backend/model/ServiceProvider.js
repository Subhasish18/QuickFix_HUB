// models/ServiceProvider.js

import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  // ✅ NEW: Firebase UID for identity checking
  firebaseUid: {
    type: String,
    required: true,
    unique: true, // Ensures one Firebase account maps to one provider
  },

  // 🔧 Existing fields
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  phoneNumber: { type: String },
  profileImage: { type: String },
  description: { type: String },
  pricingModel: { type: String },      // e.g., 'hourly', 'fixed'
  availability: { type: Object },      // e.g., { mon: ['9:00','17:00'], ... }
  serviceTypes: [{ type: String }],    // e.g., ['Plumbing', 'Electrical']
  location: { type: String },
  role: { 
    type: String, 
    enum: ['provider'], 
    default: 'provider' 
  },
}, { timestamps: true });

// 🔗 Virtual populate: services linked to provider
providerSchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'providerId',
});

const ServiceProvider = mongoose.model('ServiceProvider', providerSchema);
export default ServiceProvider;