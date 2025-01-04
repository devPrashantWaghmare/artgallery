const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // Discount amount or percentage
    isActive: { type: Boolean, default: true },
    expirationDate: { type: Date },
    usageLimit: { type: Number, default: 1 },
    timesUsed: { type: Number, default: 0 }
});

module.exports = mongoose.model('Coupon', couponSchema);
