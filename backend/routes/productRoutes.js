const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {getAllProducts, getProductById, addProduct, editProduct , deleteProduct , getProductsByCreator,getProductAttributes } = require('../controllers/productController');
// const Product = require('../models/productDetails/Product'); // Assuming you have a Product model
//api/products/getAllProducts
// /api/products/artproducts
router.get('/artproducts', getAllProducts);
router.get('/attributes', getProductAttributes);      // /api/products
router.get('/:id', getProductById);    // /api/products/:id
// Get all products
router.get('/', protect, getAllProducts);

// router.get('/users',protect, getUsers);

// // Public route to get all products
// router.get('/products',getAllProducts);
///api/products/getAllProducts
// Get a specific product by ID
router.get('/:id', protect, getProductById);

// Add a new product
router.post('/addProduct', protect, addProduct);

// Edit an existing product
router.put('/:id', protect, editProduct);

// Delete a product
router.delete('/:id', protect, deleteProduct);
router.get('/creator-products', protect, getProductsByCreator);

module.exports = router;

