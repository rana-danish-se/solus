import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      default: 'global',
    },
    fullName: {
      type: String,
      default: '',
    },
    headline: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    socials: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      reddit: { type: String, default: '' },
      instagram: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    about: {
      type: String,
      default: '',
    },
    goals: {
      type: String,
      default: '',
    },
    voice: {
      type: String,
      default: '',
    },
    resume: {
      type: String,
      default: '',
    },
    services: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
