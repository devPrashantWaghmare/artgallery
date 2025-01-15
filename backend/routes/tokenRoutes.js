/* const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const { User } = require('../models/UserDetails/baseUser');

// Refresh token route
router.post('/refreshToken', protect, async (req, res) => {
  const { user } = req; // Extract user from protect middleware
  try {
    const freshUser = await User.findById(user._id).populate('role', 'name permissions').lean();
    if (!freshUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const tokenPayload = {
      userId: freshUser._id.toString(),
      role: freshUser.role.name,
      permissions: freshUser.role.permissions,
      route: freshUser.role.route,
      userVersion: freshUser.userVersion || 1,
    };
    const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '30m',
    });
    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: 'Token refresh failed', error: error.message });
  }
});


module.exports = router;
 */


const express = require("express");
const { refreshTokenController } = require("../controllers/refreshTokenController");
const router = express.Router();

router.post("/refresh-token", refreshTokenController);

module.exports = router;
