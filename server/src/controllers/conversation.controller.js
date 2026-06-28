import Conversation from '../models/conversation.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateReplies, confirmMessage } from '../services/conversation.service.js';

const ALLOWED_PROSPECT_FIELDS = [
  'name', 'type', 'headline', 'about', 'niche', 'location',
  'socials', 'notes', 'goalOfConversation',
];

export const createConversation = asyncHandler(async (req, res) => {
  const { prospect } = req.body;
  if (!prospect || !prospect.name || !prospect.type) {
    res.status(400);
    throw new Error('Prospect name and type are required');
  }

  if (!['client', 'team'].includes(prospect.type)) {
    res.status(400);
    throw new Error('Prospect type must be "client" or "team"');
  }

  const conversation = await Conversation.create({ prospect });
  res.status(201).json(conversation);
});

export const getAllConversations = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const conversations = await Conversation.find(filter)
    .sort({ updatedAt: -1 });

  res.json(conversations);
});

export const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  res.json(conversation);
});

export const updateProspect = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  const prospectUpdates = {};
  for (const field of ALLOWED_PROSPECT_FIELDS) {
    if (req.body[field] !== undefined) {
      prospectUpdates[field] = req.body[field];
    }
  }

  Object.assign(conversation.prospect, prospectUpdates);
  await conversation.save();

  res.json(conversation);
});

export const addProspectMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400);
    throw new Error('Message content is required');
  }

  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  conversation.messages.push({
    role: 'prospect',
    content,
    createdAt: new Date(),
  });

  await conversation.save();

  let replies = [];
  try {
    replies = await generateReplies(conversation._id);
  } catch (err) {
    console.warn('[ConversationController] Reply generation failed:', err.message);
  }

  const updatedConversation = await Conversation.findById(conversation._id);

  res.json({
    conversation: updatedConversation,
    replies,
  });
});

export const confirmSentMessage = asyncHandler(async (req, res) => {
  const { messageContent } = req.body;
  if (!messageContent) {
    res.status(400);
    throw new Error('messageContent is required');
  }

  const conversation = await confirmMessage(req.params.id, messageContent);
  res.json(conversation);
});

export const archiveConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findByIdAndUpdate(
    req.params.id,
    { status: 'archived' },
    { new: true }
  );
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  res.json(conversation);
});

export const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findByIdAndDelete(req.params.id);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  res.json({ success: true, message: 'Conversation deleted' });
});
