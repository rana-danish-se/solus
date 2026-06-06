import mongoose from 'mongoose';

const contentStrategySchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ['linkedin', 'twitter', 'reddit'],
      unique: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    audience: {
      type: String,
      default: '',
    },
    tone: {
      type: String,
      default: '',
    },
    formatNotes: {
      type: String,
      default: '',
    },
    pillars: {
      type: [String],
      default: [],
    },
    maxPostsPerWeek: {
      type: Number,
      default: 4,
    },
    preferredPostingTime: {
      type: String,
      default: '',
    },
    avoidTopics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ContentStrategy = mongoose.model('ContentStrategy', contentStrategySchema);

export default ContentStrategy;
