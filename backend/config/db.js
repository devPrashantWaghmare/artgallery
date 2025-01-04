// backend/config/db.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createRoles } = require('../models/UserDetails/roleService');
const User = require('../models/UserDetails/baseUser');
const Role = require('../models/UserDetails/role'); 

const createMasterUser = async () => {
  try {
     // Find the SuperAdmin role in the Role collection
     const superAdminRole = await Role.findOne({ name: 'SuperAdmin' });
     if (!superAdminRole) {
       console.error('SuperAdmin role does not exist. Please create the SuperAdmin role first.');
       return;
     }
    // Check if a master user already exists
    const existingSuperAdmin = await User.findOne({role: superAdminRole._id });
    if (existingSuperAdmin) {
      console.log('Super Admin already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);

    // Create a master Super Admin user
    const superAdmin = new User({
      name: process.env.SUPER_ADMIN_NAME || 'Master Admin',
      email: process.env.SUPER_ADMIN_EMAIL,
      mobile: process.env.SUPER_ADMIN_MOBILE,
      password: hashedPassword,
      role: superAdminRole._id,
      isAdmin: true,
    });

    await superAdmin.save();
    console.log('Super Admin created successfully');
  } catch (error) {
    console.error('Error creating Super Admin:', error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 50000, // 50 seconds
    });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    console.log('MongoDB connected successfully');

    // Initialize roles and master user
    await createRoles()
      .then(() => console.log('Default roles created successfully'))
      .catch((err) => console.error('Error creating roles:', err));

    await createMasterUser();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
