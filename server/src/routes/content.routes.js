import express from 'express';
import {
  getIdeas,
  createIdea,
  generateNewIdeas,
  deleteIdea,
  approveIdea,
  getPosts,
  generateHookForPost,
  regenerateHook,
  generateBodyForPost,
  regenerateBody,
  generateCTAForPost,
  regenerateCTA,
  approvePost,
  updateSection,
  uploadPostImage,
  removePostImage,
  publishPost,
  polishPost,
  deletePost,
} from '../controllers/content.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';

const router = express.Router();

// Ideas
router.get('/ideas', protect, getIdeas);
router.post('/ideas', protect, createIdea);
router.post('/ideas/generate', protect, generateNewIdeas);
router.delete('/ideas/:id', protect, deleteIdea);
router.patch('/ideas/:id/approve', protect, approveIdea);

// Posts
router.get('/posts', protect, getPosts);
router.post('/posts/generate-hook', protect, generateHookForPost);
router.post('/posts/:id/regenerate-hook', protect, regenerateHook);
router.post('/posts/:id/generate-body', protect, generateBodyForPost);
router.post('/posts/:id/regenerate-body', protect, regenerateBody);
router.post('/posts/:id/generate-cta', protect, generateCTAForPost);
router.post('/posts/:id/regenerate-cta', protect, regenerateCTA);
router.patch('/posts/:id/approve', protect, approvePost);
router.patch('/posts/:id/section', protect, updateSection);
router.post('/posts/:id/image', protect, uploadImage, uploadPostImage);
router.delete('/posts/:id/image', protect, removePostImage);
router.post('/posts/:id/publish', protect, publishPost);
router.post('/posts/:id/polish', protect, polishPost);
router.delete('/posts/:id', protect, deletePost);

export default router;
