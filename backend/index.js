import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './db.js';

// Import route handlers
import userDetailsRoute from './routes/userDetailsRoute.js';
import providerDetailsRoute from './routes/providerDetailsRoute.js';
import ProviderCardShowRoute from './routes/providercardshowRoute.js';
import serviceDetailsRoute from './routes/serviceDetailsRoute.js';
import loginRoute from './routes/loginRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import bookingRoute from './routes/bookingRoute.js';
import userBookingShowingCardRoute from './routes/userBookingShowingCardRoute.js';
import providerBookingShowCardRoute from './routes/providerBookingShowCardRoute.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Define routes
app.use('/api/user-details', userDetailsRoute);
app.use('/api/provider-details', providerDetailsRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/provider-card-show', ProviderCardShowRoute);
app.use('/api/service-details', serviceDetailsRoute);
app.use('/api/login', loginRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/user-bookings', userBookingShowingCardRoute);
app.use('/api/provider-bookings', providerBookingShowCardRoute);

// Add MongoDB connection status debugging
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connection successful');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Start the server with error handling
startServer().catch(error => {
  console.error('❌ Server startup failed:', error.message);
  process.exit(1);
});
