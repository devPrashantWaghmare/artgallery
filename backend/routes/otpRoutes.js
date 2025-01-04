// // routes/otpRoutes.js
// const express = require('express');
// const { requestOtp, verifyOtp } = require('../controllers/otpController');
// const router = express.Router();

// // OTP routes
// router.post('/requestOtp', requestOtp);
// router.post('/verifyOtp', verifyOtp);

// module.exports = router;
// backend/routes/otpRoutes.js
const express = require("express");
const { requestOtp, verifyOtp } = require("../controllers/otpController");
const router = express.Router();

// OTP operations
router.post("/requestOtp", requestOtp);
router.post("/verifyOtp", verifyOtp);

module.exports = router;
