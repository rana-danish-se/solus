import mongoose from 'mongoose';

const postIdeaSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ['linkedin', 'twitter', 'reddit'],
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    angle: {
      type: String,
      default: '',
    },
    pillar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending_approval', 'approved', 'rejected'],
      default: 'pending_approval',
    },
    weekOfDate: {
      type: Date,
      default: null,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PostIdea = mongoose.model('PostIdea', postIdeaSchema);

export default PostIdea;
