const mongoose = require('mongoose');
const User = require('./baseUser');

const artistSchema = new mongoose.Schema({
  bio: { type: String },
  artCategories: { type: [String], default: [] }, // Example: ["Painting", "Sculpture"]
  artMediums: { type: [String], default: [] }, // Example: ["Oil", "Watercolor"]
  artworkUsage: {
    canSell: { type: Boolean, default: false },
    canDisplay: { type: Boolean, default: true },
  },
  verificationStatus: {
    aadhaarVerified: { type: Boolean, default: false },
    panVerified: { type: Boolean, default: false },
    bankAccountVerified: { type: Boolean, default: false },
    upiVerified: { type: Boolean, default: false },
    sampleArtworksSubmitted: { type: Boolean, default: false },
    sampleArtworksReviewed: { type: Boolean, default: false },
    sampleArtworksApproved: { type: Boolean, default: false },
    artistOnboarded: { type: Boolean, default: false },
  },
  onboardingStatus: {
    type: String,
    enum: ['NotStarted', 'InProgress', 'Completed'],
    default: 'NotStarted',
  },
  reviewDetails: {
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    reviewComments: { type: String },
  },
  verificationFeedback: { type: String },
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Subadmin managing this artist
});

// Register the discriminator
const Artist = User.discriminator('Artist', artistSchema);

module.exports = Artist;
