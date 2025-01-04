//backend/models/UserDetails/role.js
const mongoose = require('mongoose');

const permissionsSchema = new mongoose.Schema({
    manageUsers: { type: Boolean, default: false },
    manageRoles: { type: Boolean, default: false },
    monitorActivities: { type: Boolean, default: false },
    accessReports: { type: Boolean, default: false },
    systemMaintenance: { type: Boolean, default: false },
    canOnboardArtists: { type: Boolean, default: false },
    canOfferDiscounts: { type: Boolean, default: false },
    canManageProducts: { type: Boolean, default: false },
    canVerifyUsers: { type: Boolean, default: false },
    canManageOrders: { type: Boolean, default: false },
    canManageTransactions: { type: Boolean, default: false },
    canManagePayments: { type: Boolean, default: false },
  });

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    permissions: { type: permissionsSchema, required: true },
    route: { type: String, required: true }, // Add a route field
    inherits: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // Optional: Parent role
});



const Role = mongoose.model('Role', roleSchema  );
module.exports = Role;

