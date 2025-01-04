const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  ProductID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' ,
    required : true
  },
  amount: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Razorpay', 'UPI', 'Credit Card', 'Net Banking'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['initiated', 'pending', 'success', 'failed', 'refunded'], 
    default: 'initiated' 
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
},
  razorpayPaymentId: String,
  razorpaySignature: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  failureReason: String,
  completedAt: Date,
  createdAt: {
      type: Date,
      default: Date.now
  }
}, { timestamps: true });
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
      { productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtProduct', required: true }, quantity: { type: Number, default: 1 } },
  ],
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
const Cart = mongoose.model('Cart', cartSchema);
module.exports = { Transaction, Cart };