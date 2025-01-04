const mongoose = require('mongoose');

const baseUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, match: /.+\@.+\..+/ },
    mobile: { type: String, required: true ,unique : true},
    password: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    customPermissions: { type: Object, default: {} }, // Overrides for role-based permissions
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userVersion: { type: Number, default: 1 },

  },
  { timestamps: true, discriminatorKey: 'userType' }
);

const User = mongoose.model('User', baseUserSchema);
module.exports = User;
