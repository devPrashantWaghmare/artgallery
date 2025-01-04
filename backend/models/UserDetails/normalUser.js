// const mongoose = require('mongoose');

// // Base schema for common fields
// const baseUserSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, unique: true, required: true, match: /.+\@.+\..+/ }, // Email validation
//     mobile: { type: String, required: true },
//     password: { type: String }, // Hashed password
//     role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }, // Link to Role schema
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who created this user
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who last updated this user
//   },
//   { timestamps: true, discriminatorKey: 'userType' }
// );


// // Normal user-specific schema
// const normalUserSchema = new mongoose.Schema({
//   wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
//   cart: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//       quantity: { type: Number, default: 1 },
//     },
//   ],
//   orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
//   reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
// });



// // Subadmin schema (inherits from User)
// const subadminSchema = new mongoose.Schema({
//   permissions: {
//     canOnboardArtists: { type: Boolean, default: false },
//     canOfferDiscounts: { type: Boolean, default: false },
//     canManageOrders: { type: Boolean, default: false },
//     canViewReports: { type: Boolean, default: false },
//   },
// });

// // Artist-specific schema
// const artistSchema = new mongoose.Schema({
//   bio: { type: String },
//   artCategories: { type: [String], default: [] },
//   artMediums: { type: [String], default: [] },
//   artworkUsage: {
//     canSell: { type: Boolean, default: false },
//     canDisplay: { type: Boolean, default: true },
//   },
//   verificationStatus: {
//     aadhaarVerified: { type: Boolean, default: false },
//     panVerified: { type: Boolean, default: false },
//     bankAccountVerified: { type: Boolean, default: false },
//     upiVerified: { type: Boolean, default: false },
//     sampleArtworksSubmitted: { type: Boolean, default: false },
//     sampleArtworksReviewed: { type: Boolean, default: false },
//     sampleArtworksApproved: { type: Boolean, default: false },
//     artistOnboarded: { type: Boolean, default: false },
//   },
//   onboardingStatus: {
//     type: String,
//     enum: ['NotStarted', 'InProgress', 'Completed'],
//     default: 'NotStarted',
//   },
//   reviewDetails: {
//     reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     reviewStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
//     reviewComments: { type: String },
//   },
//   verificationFeedback: { type: String },
//   managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Subadmin managing this artist
// });

// // Admin-specific schema
// const adminSchema = new mongoose.Schema({
//   permissions: {
//     manageUsers: { type: Boolean, default: true },
//     manageRoles: { type: Boolean, default: true },
//     monitorActivities: { type: Boolean, default: true },
//     accessReports: { type: Boolean, default: true },
//     systemMaintenance: { type: Boolean, default: true },
//   },
//   adminLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AdminLog' }], // Track admin actions
// });

// // Models
// const User = mongoose.model('User', baseUserSchema);
// const NormalUser = User.discriminator('NormalUser', normalUserSchema);
// const Artist = User.discriminator('Artist', artistSchema);
// const Subadmin = User.discriminator('Subadmin', subadminSchema);
// const Admin = User.discriminator('Admin', adminSchema);

// // Exporting models
// module.exports = { User, NormalUser, Artist, Subadmin, Admin };
const mongoose = require('mongoose');
const User = require('./baseUser');

const normalUserSchema = new mongoose.Schema({
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

module.exports = User.discriminator('NormalUser', normalUserSchema);
