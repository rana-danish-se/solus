import mongoose from 'mongoose';

const prospectProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['client', 'team'],
    required: true,
  },
  headline: { type: String, default: '' },
  about: { type: String, default: '' },
  niche: { type: String, default: '' },
  location: { type: String, default: '' },
  socials: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    portfolio: { type: String, default: '' },
  },
  notes: { type: String, default: '' },
  goalOfConversation: { type: String, default: '' },
}, { _id: false });

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['prospect', 'me'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  confirmedSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const conversationSchema = new mongoose.Schema(
  {
    prospect: {
      type: prospectProfileSchema,
      required: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    summary: {
      type: String,
      default: '',
    },
    summaryUpTo: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
