// // backend/routes/authRoutes.js

const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { protect, isAdmin,assignRole } = require('../middleware/authMiddleware');


// Registration and login routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/user/set-password", authController.setPassword);

module.exports = router;
