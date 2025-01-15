const bcrypt = require('bcrypt'); // Added bcrypt for password hashing
const {User} = require('../models/UserDetails/baseUser');
const {Role} = require('../models/UserDetails/role');
const { Product } = require('../models/productDetails/ArtProduct');
const Notification = require('../models/Notification');

// Utility for getting user by ID
const getUserById = async (userId) => {
  try {
    return await User.findById(userId).populate('role');
  } catch (error) {
    console.error(`Error fetching user by ID: ${error}`);
    return null;
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, mobile, password, role: roleName } = req.body;
    if (!name || !email || !mobile || !password || !roleName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with the same email or mobile already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, mobile, password: hashedPassword, role: role._id });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// View user details
const viewUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role.name,
      permissions: user.permissions || {},
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    if (updates.role) {
      const role = await Role.findOne({ name: updates.role });
      if (!role) return res.status(400).json({ message: `Invalid role: ${updates.role}` });
      updates.role = role._id;
    }

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
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user details by ID
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recommended products
const getRecommendations = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user || user.role.name !== 'user') {
      return res.status(403).json({ message: 'Access restricted to normal users.' });
    }
    const recommendations = await Product.find({ recommendedFor: user.interests || [] });
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};

// Get notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

module.exports = {
  createUser,
  getUsers,
  viewUserDetails,
  updateUser,
  deleteUser,
  getUserProfile,
  getUserDetails,
  getRecommendations,
  getNotifications,
};
