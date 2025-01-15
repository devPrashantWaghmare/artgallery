// backend/controllers/adminController.js
const { User } = require('../models/UserDetails/baseUser');
const bcrypt = require('bcryptjs');
const Product = require('../models/productDetails/ArtProduct');
const Transaction = require('../models/transactions/Transaction');
const Role = require('../models/UserDetails/role'); // Import Role model


// .get(`/api/admin/users/${userId}`,
const viewUserDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('role');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("in adminController/viewUserDetails  user :",user)
    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role.name,
      permissions: user.permissions || {},
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "An error occurred while fetching user details." });
  }
};

// Create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, role, password: hashedPassword });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Edit user details
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    // If role is provided as a name, convert it to ObjectId
    if (updates.role && typeof updates.role === 'string') {
      const role = await Role.findOne({ name: updates.role });
      if (!role) {
        return res.status(400).json({ message: `Invalid role: ${updates.role}` });
      }
      updates.role = role._id; // Replace role name with ObjectId
    }

    // Update user details
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Create an admin user if it does not exist
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ mobile: process.env.ADMIN_PHONE_NUMBER });

    if (adminExists) {
      console.log("Admin user already exists with this mobile number");
      return; // Don't create a new admin if it already exists
    }

    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("Admin password not set in environment variables");
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10); // Hash the password
    const adminData = {
      mobile: process.env.ADMIN_PHONE_NUMBER,
      name: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      
    };

    const admin = new User(adminData);
    await admin.save();
    console.log("Admin user created with mobile number:", process.env.ADMIN_PHONE_NUMBER);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// Run the function to create an admin user
module.exports = { viewUserDetails, createUser, updateUser, deleteUser, createAdmin };
