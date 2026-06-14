import ContentStrategy from '../models/contentStrategy.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStrategies = asyncHandler(async (req, res) => {
  const strategies = await ContentStrategy.find().sort({ platform: 1 });
  res.json(strategies);
});

export const upsertStrategy = asyncHandler(async (req, res) => {
  const { platform } = req.params;
  if (!['linkedin', 'twitter', 'reddit'].includes(platform)) {
    res.status(400);
    throw new Error('Platform must be one of: linkedin, twitter, reddit');
  }

  const allowedFields = [
    'isActive', 'audience', 'tone', 'formatNotes',
    'pillars', 'maxPostsPerWeek', 'preferredPostingTime', 'avoidTopics',
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const strategy = await ContentStrategy.findOneAndUpdate(
    { platform },
    updates,
    { new: true, upsert: true, runValidators: true }
  );

  res.json(strategy);
});
