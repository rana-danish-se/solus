import 'dotenv/config'; // Must be the very first import in ES modules
import app from './src/app.js';
import connectDB from './config/db.js';

connectDB();

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Server listening in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
