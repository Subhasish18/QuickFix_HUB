import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    // required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    // required: true
  },
  role: {
    type: String,
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;