const express = require('express');
const router = express.Router();
const {
    createUser,
    getUserProfile,
    getUserDetails,
    getRecommendations,
    getNotifications,
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/create', protect, isAdmin, createUser); // Only admin can create users
router.get('/profile', protect, getUserProfile); // Authenticated users
router.get('/details/:userId', protect, isAdmin, getUserDetails); // Admin view user details
router.get('/recommendations', protect, getRecommendations); // Normal users
router.get('/notifications', protect, getNotifications); // Authenticated users

module.exports = router;
