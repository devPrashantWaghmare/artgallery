const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// User-related routes
router.get('/profile', protect, userController.getUserProfile); // Authenticated user profile
router.get('/details/:userId', protect, userController.getUserDetails); // Admin view user details
router.get('/recommendations', protect, userController.getRecommendations); // Recommendations for normal users
router.get('/notifications', protect, userController.getNotifications); // Authenticated user notifications
router.get('/getUsers', protect, userController.getUsers); // Get all users

// Admin-related routes
router.post('/create', protect, adminController.createUser); // Create user (admin only)
router.put('/users/:id', protect, adminController.updateUser); // Update user details
router.delete('/users/:id', protect, adminController.deleteUser); // Delete user
router.get('/users/details/:id', protect, adminController.viewUserDetails); // Admin-specific user details

module.exports = router;
