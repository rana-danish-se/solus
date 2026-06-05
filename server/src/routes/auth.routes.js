import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/auth/login
router.post('/login', login);
// POST /api/auth/logout
router.post('/logout', protect, logout);

export default router;
