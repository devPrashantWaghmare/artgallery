// const express = require('express');
// const router = express.Router();
// const { protect,verifyToken, verifyRole } = require('../middleware/authMiddleware');
// const {
//   getAllProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getProductById,
//   getArtistProducts,
//   getArtistProfile,  // New function for fetching profile
// } = require('../controllers/artistController');

// // Route to get all products (open for admins)
// router.get('/products', protect,verifyToken, getAllProducts);
// console.log(getAllProducts);

// // Route to create a product (only for authenticated artist users)
// router.post('/products', protect,verifyToken, verifyRole(['artist']), createProduct);

// // Route to update a product (only for the artist who created the product)
// router.put('/products/:id', protect,verifyToken, verifyRole(['artist']), updateProduct);

// // Route to delete a product (only for the artist who created the product)
// router.delete('/products/:id', protect,verifyToken, verifyRole(['artist']), deleteProduct);

// // Route to get a specific product by ID (authenticated users only)
// router.get('/products/:id', protect,verifyToken, getProductById);

// // Route to get all products for a specific artist (only for authenticated artists)
// router.get('/artist/products', protect,verifyToken, verifyRole(['artist']), getArtistProducts);

// // Route to get the user's profile (authenticated user)
// router.get('/profile',protect,verifyToken, verifyRole(['artist']), getArtistProfile);  // New route



// module.exports = router;

// routes/artistRoutes.js
const express = require("express");
const {
  getArtistsForReview,
  updateArtworkReviewStatus,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getArtistProducts,
  getArtistProfile,
} = require("../controllers/artistController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Admin access for artist review
router.get("/artists-review", protect, getArtistsForReview);
router.put("/artwork-review/:artworkId", protect, updateArtworkReviewStatus);

// Artist-specific routes
router.get("/products", protect,getAllProducts);
router.post("/products", protect, createProduct);
router.put("/products/:id", protect, updateProduct);
router.delete("/products/:id", protect, deleteProduct);
router.get("/products/:id", protect, getProductById);
router.get("/products", protect, getArtistProducts);
router.get("/profile", protect, getArtistProfile);

module.exports = router;
