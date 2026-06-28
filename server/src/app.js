import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import noteRoutes from './routes/note.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import contentRoutes from './routes/content.routes.js';
import contentStrategyRoutes from './routes/contentStrategy.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/content-strategy', contentStrategyRoutes);
app.use('/api/conversations', conversationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
