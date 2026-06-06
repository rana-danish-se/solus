import Settings from '../models/settings.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public / Private (depends on your auth flow, let's keep it open for reading or assume admin only if needed)
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({ type: 'global' });

  if (!settings) {
    // If none exists, we can return an empty structure or create a default one
    settings = await Settings.create({ type: 'global' });
  }

  res.json(settings);
});

const ALLOWED_FIELDS = [
  'fullName', 'headline', 'email', 'phone', 'tagline',
  'socials', 'about', 'goals', 'voice', 'resume', 'services',
];

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private
export const updateSettings = asyncHandler(async (req, res) => {
  const updates = {};
  for (const field of ALLOWED_FIELDS) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const updatedSettings = await Settings.findOneAndUpdate(
    { type: 'global' },
    updates,
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  res.json(updatedSettings);
});
