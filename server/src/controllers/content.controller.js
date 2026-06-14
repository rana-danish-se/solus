import PostIdea from '../models/postIdea.model.js';
import Post from '../models/post.model.js';
import ContentStrategy from '../models/contentStrategy.model.js';
import Settings from '../models/settings.model.js';
import cloudinary from '../../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { publishPost as publish } from '../services/publisher.service.js';
import {
  generateIdeas,
  generateHook,
  generateBody,
  generateCTA,
  assembleSections,
} from '../services/content.service.js';

// ─── Ideas ───────────────────────────────────────────────

export const generateNewIdeas = asyncHandler(async (req, res) => {
  const strategy = await ContentStrategy.findOne({ platform: 'linkedin', isActive: true });
  if (!strategy) {
    res.status(400);
    throw new Error('No active LinkedIn strategy found. Configure one in Content Strategy settings.');
  }

  const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
  const recentIdeas = await PostIdea.find({ createdAt: { $gte: fourWeeksAgo } })
    .select('topic')
    .lean();

  const rawIdeas = await generateIdeas(strategy, recentIdeas);

  const saved = await PostIdea.insertMany(
    rawIdeas.map((idea) => ({
      platform: 'linkedin',
      topic: idea.topic || '',
      angle: idea.angle || '',
      pillar: idea.pillar || '',
      status: 'pending',
    }))
  );

  res.status(201).json(saved);
});

export const deleteIdea = asyncHandler(async (req, res) => {
  const idea = await PostIdea.findByIdAndDelete(req.params.id);
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }
  res.json({ success: true });
});

export const approveIdea = asyncHandler(async (req, res) => {
  const idea = await PostIdea.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true, runValidators: true }
  );
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }
  res.json(idea);
});

export const getIdeas = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const ideas = await PostIdea.find(filter).sort({ createdAt: -1 });
  res.json(ideas);
});

export const getPosts = asyncHandler(async (req, res) => {
  const { ideaId, status } = req.query;
  const filter = {};
  if (ideaId) filter.ideaId = ideaId;
  if (status) filter.status = status;
  const posts = await Post.find(filter).sort({ createdAt: -1 });
  res.json(posts);
});

// ─── Posts ───────────────────────────────────────────────

async function loadSessionData(ideaId, res) {
  const idea = await PostIdea.findById(ideaId);
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }
  const strategy = await ContentStrategy.findOne({ platform: idea.platform, isActive: true });
  const settings = await Settings.findOne({ type: 'global' });
  return { idea, strategy, settings };
}

export const generateHookForPost = asyncHandler(async (req, res) => {
  const { ideaId } = req.body;
  if (!ideaId) {
    res.status(400);
    throw new Error('ideaId is required');
  }

  const { idea, strategy, settings } = await loadSessionData(ideaId, res);
  const hookText = await generateHook(idea, strategy, settings);

  const post = await Post.create({
    ideaId: idea._id,
    platform: idea.platform,
    sections: { hook: hookText, body: '', cta: '' },
    status: 'draft',
  });

  res.status(201).json(post);
});

export const regenerateHook = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const { idea, strategy, settings } = await loadSessionData(post.ideaId, res);
  const hookText = await generateHook(idea, strategy, settings);

  post.sections.hook = hookText;
  post.sections.body = '';
  post.sections.cta = '';
  await post.save();

  res.json(post);
});

export const generateBodyForPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const { idea, strategy, settings } = await loadSessionData(post.ideaId, res);
  const bodyText = await generateBody(idea, strategy, settings, post.sections.hook);

  post.sections.body = bodyText;
  await post.save();

  res.json(post);
});

export const regenerateBody = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const { idea, strategy, settings } = await loadSessionData(post.ideaId, res);
  const bodyText = await generateBody(idea, strategy, settings, post.sections.hook);

  post.sections.body = bodyText;
  post.sections.cta = '';
  await post.save();

  res.json(post);
});

export const generateCTAForPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const { idea, strategy, settings } = await loadSessionData(post.ideaId, res);
  const ctaText = await generateCTA(idea, strategy, settings, post.sections.hook, post.sections.body);

  post.sections.cta = ctaText;
  await post.save();

  res.json(post);
});

export const regenerateCTA = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const { idea, strategy, settings } = await loadSessionData(post.ideaId, res);
  const ctaText = await generateCTA(idea, strategy, settings, post.sections.hook, post.sections.body);

  post.sections.cta = ctaText;
  await post.save();

  res.json(post);
});

export const approvePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (!post.sections.hook || !post.sections.body || !post.sections.cta) {
    res.status(400);
    throw new Error('All sections (hook, body, cta) must be populated before approving');
  }

  post.content = assembleSections(post.sections.hook, post.sections.body, post.sections.cta);
  post.status = 'approved';
  await post.save();

  res.json(post);
});

export const updateSection = asyncHandler(async (req, res) => {
  const { section, text } = req.body;
  if (!section || !['hook', 'body', 'cta'].includes(section)) {
    res.status(400);
    throw new Error('Valid section field is required: hook, body, or cta');
  }
  if (text === undefined || text === null) {
    res.status(400);
    throw new Error('text is required');
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.sections[section] = text;

  if (section === 'hook') {
    post.sections.body = '';
    post.sections.cta = '';
  } else if (section === 'body') {
    post.sections.cta = '';
  }

  await post.save();
  res.json(post);
});

export const uploadPostImage = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided. Use field name "image".');
  }

  post.image = {
    url: req.file.path,
    publicId: req.file.filename,
    source: 'uploaded',
  };
  await post.save();

  res.json(post);
});

export const removePostImage = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.image?.publicId) {
    try {
      await cloudinary.uploader.destroy(post.image.publicId);
    } catch (err) {
      console.warn('[ContentController] Failed to delete image from Cloudinary:', err.message);
    }
  }

  post.image = { url: '', publicId: '', source: 'none' };
  await post.save();

  res.json(post);
});

export const publishPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const { scheduledAt } = req.body;

  if (scheduledAt) {
    const scheduleDate = new Date(scheduledAt);
    if (scheduleDate > new Date()) {
      post.status = 'scheduled';
      post.scheduledAt = scheduleDate;
      await post.save();
      res.json(post);
      return;
    }
  }

  await publish(post._id);
  const updated = await Post.findById(post._id);
  res.json(updated);
});
