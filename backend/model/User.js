import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String },
    location: { type: String },
  }, { timestamps: true });
  
  // Virtual populate: bookings made by user
  userSchema.virtual('bookings', {
    ref: 'Booking',            // The model to use
    localField: '_id',         // Find bookings where `localField`
    foreignField: 'userId',    // is equal to `foreignField`
  });
  
const User = mongoose.model('User', userSchema);
export default User;