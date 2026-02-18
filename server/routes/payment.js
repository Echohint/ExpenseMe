const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const User = require('../models/User');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('FATAL ERROR: Razorpay keys are missing in environment variables.');
    console.error('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Fallback to prevent crash during require, though it will fail later if invalid
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// Plan definitions (backend source of truth)
const plans = {
    monthly: { amount: 9900, currency: 'INR', duration_days: 30 }, // ₹99
    quarterly: { amount: 24900, currency: 'INR', duration_days: 90 }, // ₹249
    semiannual: { amount: 49900, currency: 'INR', duration_days: 180 }, // ₹499
    yearly: { amount: 89900, currency: 'INR', duration_days: 365 } // ₹899
};

// @route   POST api/payment/order
// @desc    Create Razorpay Order
// @access  Private
router.post('/order', auth, async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = plans[planId];

        if (!plan) {
            return res.status(400).json({ msg: 'Invalid plan selected' });
        }

        const options = {
            amount: plan.amount,
            currency: plan.currency,
            receipt: `receipt_order_${Date.now()}`,
            notes: {
                userId: req.user.id,
                planId: planId
            }
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (err) {
        console.error('Razorpay Order Error:', err);
        res.status(500).send('Payment initiation failed');
    }
});

// @route   POST api/payment/verify
// @desc    Verify Payment Signature and Activate Subscription
// @access  Private
router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const plan = plans[planId];
            if (!plan) return res.status(400).json({ msg: 'Invalid plan' });

            // Calculate expiry
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + plan.duration_days);

            // Update User
            await User.findByIdAndUpdate(req.user.id, {
                isPremium: true,
                planType: planId,
                subscriptionExpiry: expiryDate
            });

            res.json({ success: true, msg: 'Subscription activated!', expiry: expiryDate });
        } else {
            res.status(400).json({ success: false, msg: 'Invalid payment signature' });
        }

    } catch (err) {
        console.error('Payment Verification Error:', err);
        res.status(500).send('Verification failed');
    }
});

module.exports = router;
