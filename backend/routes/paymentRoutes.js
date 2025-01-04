// const express = require('express');
// const { createOrder, verifyPayment } = require('../controllers/paymentController');

// const router = express.Router();

// router.post('/create-order', createOrder);
// router.post('/verify', verifyPayment);

// module.exports = router;

// routes/paymentRoutes.js
const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const router = express.Router();

// Payment operations
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;
