const mongoose = require('mongoose');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/UserDetails/baseUser');
const Transaction = require('../models/transactions/Transaction');
const Payment = require('../models/transactions/Payment');

// Verify Payment
exports.verifyPayment = async (req, res) => {
    const { 
        userId, 
        razorpayOrderId, 
        razorpayPaymentId, 
        razorpaySignature, 
        email 
    } = req.body;
    
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the transaction first
        const transaction = await Transaction.findOne({ razorpayOrderId }).session(session);
        
        if (!transaction) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Verify signature
        const generatedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        if (generatedSignature !== razorpaySignature) {
            // Update transaction status to failed
            transaction.status = 'failed';
            transaction.failureReason = 'Invalid signature';
            await transaction.save({ session });
            
            await session.commitTransaction();
            return res.status(400).json({ 
                status: 'failure', 
                message: 'Invalid signature' 
            });
        }

        // Find or create user
        let user = await User.findById(userId).session(session);
        
        if (!user) {
            user = new User({
                isGuest: true,
                needsPasswordSetup: true,
                email: email || undefined, // Only set email if it's provided
            });
            await user.save({ session });
        } else if (user.isGuest && !user.password) {
            user.needsPasswordSetup = true;
            if (email && !user.email) {
                user.email = email;
            }
            await user.save({ session });
        }

        // Update transaction
        transaction.status = 'success';
        transaction.razorpayPaymentId = razorpayPaymentId;
        transaction.razorpaySignature = razorpaySignature;
        transaction.completedAt = new Date();
        await transaction.save({ session });

        // Update user's courses (assuming you have a courses array in user model)
        if (transaction.courseId) {
            if (!user.courses) user.courses = [];
            if (!user.courses.includes(transaction.courseId)) {
                user.courses.push(transaction.courseId);
                await user.save({ session });
            }
        }

        await session.commitTransaction();

        res.json({
            status: 'success',
            needsPasswordSetup: user.needsPasswordSetup,
            userId: user._id,
            transactionId: transaction._id
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error verifying payment:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Failed to verify payment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        session.endSession();
    }
};

// Create Order
exports.createOrder = async (req, res) => {
    const { amount, userId, courseId, receipt, userInfo } = req.body;

    if (!userInfo || !userInfo.mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    if (!amount || !userId || !courseId) {
        return res.status(400).json({ message: 'Amount, userId, and courseId are required' });
    }

    try {
        const instance = new Razorpay({
            key_id: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_iHibAN0ENPf7D4',
            key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET || 'WpKuJ0QztLbV0aXPK4mk1cwG',
        });

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: receipt,
            payment_capture: 1,
        };

        const order = await instance.orders.create(options);

        const transaction = new Transaction({
            userId,
            courseId,
            amount,
            paymentMethod: 'Razorpay',
            status: 'initiated',
            razorpayOrderId: order.id,
        });

        await transaction.save();
        res.status(201).json({ orderId: order.id });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create Razorpay order' });
    }

exports.getPaymentInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        const paymentInfo = await Payment.find({ userId });
        res.status(200).json({ data: paymentInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment info', error });
    }
};

};
