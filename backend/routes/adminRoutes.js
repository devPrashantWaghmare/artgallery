const express = require('express');
const { createUser, updateUser, deleteUser,viewUserDetails } = require('../controllers/adminController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getArtistsForReview, updateArtworkReviewStatus } = require('../controllers/artistController');

// Only admins can access these routes
//router.get('/users/getUsers',/* protect, *//* verifyRole(['admin']), */  getUsers);


router.delete("/users/:id", protect,  deleteUser);
router.post("/users", protect,  createUser);
router.put("/users/:id", protect, updateUser);
router.get("/users/:id", protect,viewUserDetails);

//Fetch artists and sample artwork for review
router.get('/artists-review', protect, getArtistsForReview);

// Update artwork review status
router.put('/artwork-review/:artworkId', protect, updateArtworkReviewStatus);
module.exports = router;

