// seed.js — MongoDB Seed Script for MERN Marketplace
// Run with: node seed.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './model/User.js';
import ServiceProvider from './model/ServiceProvider.js';
import Admin from './model/AdminModel.js';
import Service from './model/Service.js';
import Booking from './model/Booking.js';
import Review from './model/Review.js';

dotenv.config();

async function seed() {
  try {
    const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared');

    // ----------- Create Customers (10) -----------
    const customerData = [];
    for (let i = 1; i <= 10; i++) {
      customerData.push({
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        passwordHash: '$2b$10$placeholder',
        phoneNumber: `90000000${i}`,
        location: ['New York','Los Angeles','Chicago','Houston','Miami'][i % 5],
        profileImage: `https://picsum.photos/seed/user${i}/200/200`
      });
    }
    const customers = await User.insertMany(customerData);
    console.log('Created', customers.length, 'customers');

    // ----------- Create Service Providers (10) -----------
    const providerData = [];
    const serviceTypesList = ['Plumbing','Electrical','Tutoring','Cleaning','Gardening','Painting'];
    for (let i = 1; i <= 10; i++) {
      providerData.push({
        name: `Provider ${i}`,
        email: `provider${i}@example.com`,
        passwordHash: '$2b$10$placeholder',
        phoneNumber: `91000000${i}`,
        profileImage: `https://picsum.photos/seed/provider${i}/200/200`,
        description: `Professional ${serviceTypesList[i % serviceTypesList.length]} specialist`,
        pricingModel: i % 2 === 0 ? 'hourly' : 'fixed',
        availability: { mon: ['9:00','17:00'], tue: ['10:00','18:00'] },
        approved: true,
        serviceTypes: [serviceTypesList[i % serviceTypesList.length]],
        location: ['New York','Los Angeles','Chicago','Houston','Miami'][i % 5]
      });
    }
    const providers = await ServiceProvider.insertMany(providerData);
    console.log('Created', providers.length, 'service providers');

    // ----------- Create Admin -----------
    const admin = await Admin.create({
      username: 'superadmin',
      email: 'admin@marketplace.com',
      password: '$2b$10$adminplaceholder',
      role: 'admin',
      isActive: true
    });
    console.log('Created admin account');

    // ----------- Create Services (one per provider) -----------
    const serviceData = providers.map((prov, idx) => ({
      providerId: prov._id,
      title: `${prov.serviceTypes[0]} Service ${idx + 1}`,
      category: prov.serviceTypes[0],
      description: `High-quality ${prov.serviceTypes[0].toLowerCase()} services`,
      price: 50 + idx * 10,
      images: [`https://picsum.photos/seed/service${idx}/300/200`],
      location: prov.location
    }));
    const services = await Service.insertMany(serviceData);
    console.log('Created', services.length, 'services');

    // ----------- Create Bookings (one per customer) -----------
    const bookingData = customers.map((cust, idx) => ({
      userId: cust._id,
      serviceId: services[idx % services.length]._id,
      scheduledTime: new Date(Date.now() + (idx + 1) * 86400000), // spread out over next days
      status: 'confirmed',
      paymentStatus: 'paid'
    }));
    const bookings = await Booking.insertMany(bookingData);
    console.log('Created', bookings.length, 'bookings');

    // ----------- Create Reviews (one per booking) -----------
    const reviewData = bookings.map((bk, idx) => ({
      serviceId: bk.serviceId,
      userId: bk.userId,
      rating: (idx % 5) + 1,
      comment: 'Great service provided!',
      approved: true
    }));
    const reviews = await Review.insertMany(reviewData);
    console.log('Created', reviews.length, 'reviews');

    console.log('Seeding completed');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
