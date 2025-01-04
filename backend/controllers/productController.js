// controllers/productController.js

const Product = require("../models/productDetails/ArtProduct"); // Assuming you have a Product model

// productController.js
getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Assuming `Product` is your model

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products in getAllProducts" });
  }
};
const getProductAttributes = async (req, res) => {
  try {
    console.log('Fetching product attributes...');

    // Enum values from the schema
    const categories = ['painting', 'sculpture', 'digital art', 'photography', 'other'];
    const types = ['image', 'digital', 'physical'];

    res.status(200).json({ categories, types });
  } catch (error) {
    console.error('Failed to fetch product attributes:', error.message);
    res.status(500).json({ message: 'Failed to fetch product attributes' });
  }
};

// Example route definition
const express = require('express');
const router = express.Router();



module.exports = router;


addProduct = async (req, res) => {
  try {
    // Create a new product instance with productData
    const { title, type, price } = req.body;
    if (!title || !type || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newProduct = new Product(req.body);

    // Save the new product to the database
    await newProduct.save();

    console.log("Product added successfully:", newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};
// Example in productController.js
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Ensure this is `id` to match route
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product getProductById" });
  }
};

// Edit Product
const editProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the modified document
        runValidators: true, // Ensure model validations are applied
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product updated successfully:", updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product deleted successfully:", deletedProduct);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
async function getProductsByCreator(req, res) {
  try {
    const creatorId = req.user.id; // Assumes authenticated user
    const products = await Product.find({ createdBy: creatorId });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products getProductsByCreator", error: error.message });
  }
  
}

module.exports = {
   getAllProducts,
   addProduct,
  getProductById,
  editProduct,
  deleteProduct,
  getProductsByCreator,
  getProductAttributes,
};
