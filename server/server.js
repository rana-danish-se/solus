import 'dotenv/config';
import app from './src/app.js';
import connectDB from './config/db.js';
import { startScheduler } from './src/scheduler.js';

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set');
  process.exit(1);
}

const port = process.env.PORT || 4000;

async function main() {
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`Server listening in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  });

  startScheduler();

  process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

main();
