import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import {connectDB} from "./db.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Add MongoDB connection status debugging
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connection successful');
    
    app.listen(5000, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

// Start the server with error handling
startServer().catch(error => {
  console.error('❌ Server startup failed:', error.message);
  process.exit(1);
});