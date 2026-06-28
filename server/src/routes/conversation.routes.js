import express from 'express';
import {
  createConversation,
  getAllConversations,
  getConversationById,
  updateProspect,
  addProspectMessage,
  confirmSentMessage,
  archiveConversation,
  deleteConversation,
} from '../controllers/conversation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createConversation)
  .get(protect, getAllConversations);

router.route('/:id')
  .get(protect, getConversationById)
  .delete(protect, deleteConversation);

router.put('/:id/prospect', protect, updateProspect);
router.post('/:id/messages', protect, addProspectMessage);
router.post('/:id/confirm', protect, confirmSentMessage);
router.put('/:id/archive', protect, archiveConversation);

export default router;
