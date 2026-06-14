import mongoose from 'mongoose';

const revisionSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    revisedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    source: {
      type: String,
      enum: ['uploaded', 'generated', 'none'],
      default: 'none',
    },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    ideaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostIdea',
      default: null,
    },
    platform: {
      type: String,
      enum: ['linkedin', 'twitter', 'reddit'],
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    sections: {
      hook: { type: String, default: '' },
      body: { type: String, default: '' },
      cta: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['draft', 'pending_approval', 'approved', 'scheduled', 'published', 'failed'],
      default: 'draft',
    },
    image: {
      type: imageSchema,
      default: () => ({}),
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    linkedinPostId: {
      type: String,
      default: '',
    },
    revisions: {
      type: [revisionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
