const express = require('express');
const router = express.Router();
const { protect, isAdmin, verifyToken } = require('../middleware/authMiddleware');
const {getAllProducts, getProductById, addProduct, editProduct , deleteProduct , getProductsByCreator,getProductAttributes } = require('../controllers/productController');
// const Product = require('../models/productDetails/Product'); // Assuming you have a Product model
//api/products/getAllProducts
// /api/products/artproducts
router.get('/artproducts', getAllProducts);
router.get('/attributes', getProductAttributes);      // /api/products
router.get('/:id', getProductById);    // /api/products/:id
// Get all products
router.get('/', protect, isAdmin , getAllProducts);

// router.get('/users',protect,isAdmin, getUsers);

// // Public route to get all products
// router.get('/products',getAllProducts);
///api/products/getAllProducts
// Get a specific product by ID
router.get('/:id', protect, isAdmin,getProductById);

// Add a new product
router.post('/addProduct', protect, isAdmin,addProduct);

// Edit an existing product
router.put('/:id', protect, isAdmin,editProduct);

// Delete a product
router.delete('/:id', protect, isAdmin,deleteProduct);
router.get('/creator-products', protect, verifyToken, getProductsByCreator);

module.exports = router;

