import express from 'express';
import { getStrategies, upsertStrategy } from '../controllers/contentStrategy.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getStrategies);
router.put('/:platform', protect, upsertStrategy);

export default router;
