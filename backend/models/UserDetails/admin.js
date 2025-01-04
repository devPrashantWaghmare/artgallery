const mongoose = require('mongoose');
const User = require('./baseUser');

const adminSchema = new mongoose.Schema({
  permissions: {
    manageUsers: { type: Boolean, default: true },
    manageRoles: { type: Boolean, default: true },
    monitorActivities: { type: Boolean, default: true },
    accessReports: { type: Boolean, default: true },
    systemMaintenance: { type: Boolean, default: true },
  },
  adminLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AdminLog' }], // Log of actions performed by the admin
});

// Register the discriminator
const Admin = User.discriminator('Admin', adminSchema);

module.exports = Admin;
