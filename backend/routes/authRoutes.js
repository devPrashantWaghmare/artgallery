// // backend/routes/authRoutes.js
const { registerUser, setPassword, socialLogin } = require('../controllers/authController');

const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { protect, isAdmin,assignRole } = require('../middleware/authMiddleware');


// Registration and login routes
// router.post("/register", registerUser);
// //router.post("/login", loginUser);
// router.post("/user/set-password", setPassword);
router.post("/social-login",socialLogin);

module.exports = router;
