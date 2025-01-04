// backend/controllers/authController.js
const Role = require('../models/UserDetails/role');
const User = require('../models/UserDetails/baseUser'); // Ensure correct path
const Artist = require('../models/UserDetails/artist'); // Ensure correct path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../middleware/tokenService');

// Registration controller
exports.registerUser = async (req, res) => {
  const { name, email, mobile, password, isArtist, artCategories } = req.body;

  // Input validation
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (isArtist && (!artCategories || artCategories.length === 0)) {
    return res.status(400).json({ message: 'Art categories are required for artists' });
  }

  try {
    const roleName = isArtist ? 'artist' : 'user';
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with the same email or mobile already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Select appropriate model based on user type
    const newUser = isArtist
      ? new Artist({ name, email, mobile, password: hashedPassword, role: role._id, artCategories })
      : new User({ name, email, mobile, password: hashedPassword, role: role._id });

    const savedUser = await newUser.save();
    const fullRole = await Role.findById(savedUser.role);

    const token = generateToken({userId : savedUser._id});
    res.status(201).json({
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, mobile: savedUser.mobile },
      role: fullRole?.name,
      token,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or mobile already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
exports.loginUser = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ message: 'Mobile and password are required' });
  }

  try {
    const user = await User.findOne({ mobile }).populate('role', 'name permissions');
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = generateToken({userId : user._id});
    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
      token,
      isAdmin: user.isAdmin,
      role: user.role.name,
      message: 'Login successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set password controller
exports.setPassword = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: 'User ID and password are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user || !user.needsPasswordSetup) {
      return res.status(400).json({ message: 'Invalid request or password already set' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.needsPasswordSetup = false;
    user.isGuest = false;
    await user.save();

    const token = generateToken({userId : user._id});
    res.status(200).json({ success: true, token, message: 'Password set successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
