import express from 'express';
import {
  scrapeUrlPreview,
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} from '../controllers/resources.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/scrape', protect, scrapeUrlPreview);

router.route('/')
  .post(protect, createResource)
  .get(protect, getAllResources);

router.route('/:id')
  .get(protect, getResourceById)
  .put(protect, updateResource)
  .delete(protect, deleteResource);

export default router;
