import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['concept', 'snippet', 'prompt', 'framework', 'insight'],
      default: 'insight',
    },
    tags: {
      type: [String],
      default: [],
    },
    takeaways: {
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

noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Note = mongoose.model('Note', noteSchema);

export default Note;
