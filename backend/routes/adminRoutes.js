const express = require('express');
const { getUsers, createUser, updateUser, deleteUser,viewUserDetails } = require('../controllers/adminController');
const router = express.Router();
const { protect, isAdmin,verifyToken,verifyRole } = require('../middleware/authMiddleware');
const { getArtistsForReview, updateArtworkReviewStatus } = require('../controllers/artistController');

// Only admins can access these routes
router.get('/users/getUsers',protect,verifyRole(['admin']), getUsers);
router.delete("/users/:id", protect, verifyRole(["admin"]), deleteUser);
router.post("/users", protect, verifyRole(["admin"]), createUser);
router.put("/users/:id", protect, verifyRole(["admin"]), updateUser);
router.get("/users/:id", protect, verifyRole(["admin"]), viewUserDetails);

//Fetch artists and sample artwork for review
router.get('/artists-review', protect, isAdmin, getArtistsForReview);

// Update artwork review status
router.put('/artwork-review/:artworkId', protect, isAdmin, updateArtworkReviewStatus);
module.exports = router;

