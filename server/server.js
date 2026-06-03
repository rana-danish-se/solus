import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to database
// Uncomment when you have a local MongoDB running or MongoDB URI set in .env
connectDB();

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Server listening in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
