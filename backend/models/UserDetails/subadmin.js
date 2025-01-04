const mongoose = require('mongoose');
const User = require('./baseUser.schema');

const subadminSchema = new mongoose.Schema({
  permissions: {
    canOnboardArtists: { type: Boolean, default: false },
    canOfferDiscounts: { type: Boolean, default: false },
    canManageOrders: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
  },
});

// Register the discriminator
const Subadmin = User.discriminator('Subadmin', subadminSchema);

module.exports = Subadmin;
