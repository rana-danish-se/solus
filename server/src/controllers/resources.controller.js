import Resource from '../models/resource.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { scrapeUrl } from '../services/scraper.js';

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const scrapeUrlPreview = asyncHandler(async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    res.status(400);
    throw new Error('A valid url is required');
  }

  const metadata = await scrapeUrl(url);
  res.json(metadata);
});

export const createResource = asyncHandler(async (req, res) => {
  const { url, title, siteName, favicon, metaDescription, description, category, tags } = req.body;

  if (!url || typeof url !== 'string') {
    res.status(400);
    throw new Error('URL is required');
  }
  if (!category || typeof category !== 'string') {
    res.status(400);
    throw new Error('Category is required');
  }

  try {
    const resource = await Resource.create({
      url,
      title: title || '',
      siteName: siteName || '',
      favicon: favicon || '',
      metaDescription: metaDescription || '',
      description: description || '',
      category,
      tags: Array.isArray(tags) ? tags : [],
    });
    res.status(201).json(resource);
  } catch (err) {
    if (err && err.code === 11000) {
      res.status(400);
      throw new Error('Resource already saved.');
    }
    throw err;
  }
});

export const getAllResources = asyncHandler(async (req, res) => {
  const { category, tag, search, page = 1, limit = 50 } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (tag) filter.tags = { $regex: new RegExp(tag, 'i') };

  if (search && typeof search === 'string' && search.trim()) {
    const safe = escapeRegex(search.trim());
    const regex = new RegExp(safe, 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const resources = await Resource.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  res.json(resources);
});

export const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json(resource);
});

export const updateResource = asyncHandler(async (req, res) => {
  const { title, description, category, tags } = req.body;
  const updateFields = {};

  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (category !== undefined) updateFields.category = category;
  if (tags !== undefined) {
    updateFields.tags = Array.isArray(tags) ? tags : [];
  }

  const resource = await Resource.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  res.json(resource);
});

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json({ success: true, message: 'Resource deleted' });
});
