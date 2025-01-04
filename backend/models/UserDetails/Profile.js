const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensure one profile per user
  },
  avatar: {
    type: String, // URL or path to profile picture
    required: true,
  },
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
  },
  artisticStatement: {
    type: String, // Artist's vision or mission statement
    maxlength: 500,
  },
  categories: {
    type: [String], // Art categories (e.g., Abstract, Portraits)
    default: [],
  },
  portfolio: {
    artworks: [
      {
        title: { type: String, required: true },
        description: { type: String },
        year: { type: Number },
        medium: { type: String }, // e.g., Acrylic, Watercolor
        dimensions: { type: String }, // e.g., "24x36 inches"
        images: [{ type: String }], // Array of image URLs
      },
    ],
    videos: [
      {
        title: { type: String },
        url: { type: String }, // Video hosting platform URL
        description: { type: String },
      },
    ],
  },
  achievements: {
    exhibitions: [
      {
        title: { type: String },
        venue: { type: String },
        date: { type: Date },
        description: { type: String },
      },
    ],
    awards: [
      {
        title: { type: String },
        organization: { type: String },
        year: { type: Number },
        description: { type: String },
      },
    ],
    pressMentions: [
      {
        title: { type: String },
        publication: { type: String },
        date: { type: Date },
        url: { type: String },
      },
    ],
  },
  certifications: [
    {
      title: { type: String },
      issuingOrganization: { type: String },
      issueDate: { type: Date },
      certificateUrl: { type: String }, // URL to certificate image or PDF
    },
  ],
  promotionalAssets: {
    photos: [{ type: String }], // URLs of additional marketing photos
    videos: [{ type: String }], // URLs of promotional videos
    blogs: [
      {
        title: { type: String },
        content: { type: String },
        date: { type: Date },
        url: { type: String },
      },
    ],
  },
  verificationStatus: {
    aadhaarVerified: { type: Boolean, default: false },
    panVerified: { type: Boolean, default: false },
    bankAccountVerified: { type: Boolean, default: false },
    upiVerified: { type: Boolean, default: false },
    sampleArtworksSubmitted: { type: Boolean, default: false },
  },
  financials: {
    paymentMethods: {
      upi: { type: String },
      bankAccount: { type: String },
      paypal: { type: String },
    },
    transactionHistory: [
      {
        transactionId: { type: String },
        amount: { type: Number },
        date: { type: Date },
        status: { type: String }, // e.g., Completed, Pending, Failed
      },
    ],
  },
  socialMedia: {
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    website: { type: String },
  },
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
});

module.exports = mongoose.model('Profile', ProfileSchema);
