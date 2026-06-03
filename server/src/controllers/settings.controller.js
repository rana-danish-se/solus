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

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private
export const updateSettings = asyncHandler(async (req, res) => {
  // We expect the body to have all the fields we want to update
  const updatedSettings = await Settings.findOneAndUpdate(
    { type: 'global' },
    req.body,
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  res.json(updatedSettings);
});
