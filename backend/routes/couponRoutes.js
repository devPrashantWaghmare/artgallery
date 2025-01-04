// const express = require('express');
// const Coupon = require('../models/transactions/Coupon');
// const router = express.Router();

// router.post('/applyCoupon', async (req, res) => {
//     try {
//         const { coupon: couponCode } = req.body;

//         // Find the coupon by code
//         const coupon = await Coupon.findOne({ code: couponCode });

//         // Validate coupon
//         if (!coupon) {
//             return res.json({ success: false, message: 'Coupon not found' });
//         }
//         if (!coupon.isActive) {
//             return res.json({ success: false, message: 'Coupon is not active' });
//         }
//         if (coupon.expirationDate && coupon.expirationDate < new Date()) {
//             return res.json({ success: false, message: 'Coupon has expired' });
//         }
//         if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
//             return res.json({ success: false, message: 'Coupon usage limit reached' });
//         }

//         // Apply coupon (calculate discount)
//         const discount = coupon.discount;

//         // Update coupon usage
//         coupon.timesUsed += 1;
//         await coupon.save();

//         res.json({ success: true, discount });
//     } catch (error) {
//         console.error('Error applying coupon:', error);
//         res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
//     }
// });

// module.exports = router;
// routes/couponRoutes.js
const express = require("express");
const Coupon = require("../models/transactions/Coupon");
const router = express.Router();

router.post("/applyCoupon", async (req, res) => {
  try {
    const { coupon: couponCode } = req.body;

    // Validate coupon
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon || !coupon.isActive) {
      return res.json({ success: false, message: "Invalid or inactive coupon" });
    }
    if (coupon.expirationDate && coupon.expirationDate < new Date()) {
      return res.json({ success: false, message: "Coupon expired" });
    }
    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return res.json({ success: false, message: "Usage limit reached" });
    }

    // Apply coupon and update usage
    const discount = coupon.discount;
    coupon.timesUsed += 1;
    await coupon.save();

    res.json({ success: true, discount });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
