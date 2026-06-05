import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'URL is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    siteName: {
      type: String,
      default: '',
      trim: true,
    },
    favicon: {
      type: String,
      default: '',
      trim: true,
    },
    metaDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ title: 'text', description: 'text' });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
