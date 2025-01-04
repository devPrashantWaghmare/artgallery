const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    price: { type: Number, required: true },
    installments: Number,
    discount: { type: Number, default: 0 },
    effectiveDate: { type: Date, default: Date.now }
});

const Pricing = mongoose.model('Pricing', pricingSchema);
module.exports = Pricing;
