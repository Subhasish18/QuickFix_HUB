import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true, // 🔐 Ensure 1-to-1 link between Firebase account and user
  },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  phoneNumber: { type: String },

  // ✅ Replaced single location with city & state for API-based dropdown
  city: { type: String, required: true },
  state: { type: String, required: true },

  role: { 
    type: String, 
    enum: ['user'], 
    default: 'user' 
  },
}, { timestamps: true });

// Virtual populate: connect this user to their bookings
userSchema.virtual('bookings', {
  ref: 'Booking',            // Related model
  localField: '_id',         // Local field to match
  foreignField: 'userId',    // Booking model's reference field
});

const User = mongoose.model('User', userSchema);
export default User;
