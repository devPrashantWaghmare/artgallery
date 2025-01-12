const mongoose = require("mongoose");

// Base User Schema
const baseUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, match: /.+\@.+\..+/ },
    mobile: { type: String ,default : '' },
    password: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    customPermissions: { type: Object, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userVersion: { type: Number, default: 1 },
    otpToken: { type: String, sparse: true },
    otpVerified: { type: Boolean, default: false },
    linkedAccounts: [
      {
        provider: { type: String, required: true },
        providerAccountId: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true, discriminatorKey: "userType" }
);

// Account Schema
const accountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Date },
    session: { type: Object },
    lastLogin: { type: Date, default: Date.now },
    otpSessionId: { type: String, sparse: true },
    otpExpiry: { type: Date, sparse: true },
    otpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Redis Cache Schema
const redisCacheSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionData: { type: Object },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    permissions: { type: Object },
    version: { type: Number },
  },
  { timestamps: true }
);

// Models
const User = mongoose.model("User", baseUserSchema);
const Account = mongoose.model("Account", accountSchema);
const RedisCache = mongoose.model("RedisCache", redisCacheSchema);

module.exports =  {User, Account, RedisCache };
