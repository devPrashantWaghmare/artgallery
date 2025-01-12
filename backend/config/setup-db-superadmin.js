// backend/config/setup-db-superadmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createRoles } = require('../models/UserDetails/roleService');
const {User, RedisCache} = require('../models/UserDetails/baseUser');
const Role = require('../models/UserDetails/role');

const createSuperAdmin = async () => {
  try {
    const superAdminRole = await Role.findOne({ name: 'SuperAdmin' });
    if (!superAdminRole) {
      console.error('SuperAdmin role does not exist. Please create the SuperAdmin role first.');
      return;
    }

    const existingSuperAdmin = await User.findOne({ role: superAdminRole._id });
    if (existingSuperAdmin) {
      console.log('Super Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'defaultSecurePassword', 10);

    const superAdmin = new User({
      name: process.env.SUPER_ADMIN_NAME || 'Master Admin',
      email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com',
      mobile: process.env.SUPER_ADMIN_MOBILE || '1234567890',
      password: hashedPassword,
      role: superAdminRole._id,
      isAdmin: true,
      createdBy: null, // System-created
    });

    const savedUser = await superAdmin.save();

    const cacheEntry = new RedisCache({
      userId: savedUser._id,
      role: superAdminRole._id,
      permissions: superAdminRole.permissions,
      version: 1,
    });
    await cacheEntry.save();

    console.log('Super Admin created successfully');
  } catch (error) {
    console.error('Error creating Super Admin:', error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your_database_name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, // 50 seconds
    });

    console.log('MongoDB connected successfully');

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    // Initialize roles and Super Admin
    await createRoles()
      .then(() => console.log('Default roles created successfully'))
      .catch((err) => console.error('Error creating roles:', err));

    await createSuperAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
