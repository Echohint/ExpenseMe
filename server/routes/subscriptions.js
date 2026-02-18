const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

// @route   GET api/subscriptions
// @desc    Get all user subscriptions
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user.id }).sort({ nextPaymentDate: 1 });
        res.json(subscriptions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/subscriptions
// @desc    Add new subscription
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, amount, billingCycle, startDate, category } = req.body;

    try {
        // Calculate next payment date
        const start = new Date(startDate || Date.now());
        let nextPayment = new Date(start);

        if (billingCycle === 'Monthly') nextPayment.setMonth(nextPayment.getMonth() + 1);
        else if (billingCycle === 'Quarterly') nextPayment.setMonth(nextPayment.getMonth() + 3);
        else if (billingCycle === 'Yearly') nextPayment.setFullYear(nextPayment.getFullYear() + 1);

        const newSubscription = new Subscription({
            user: req.user.id,
            name,
            amount,
            billingCycle,
            startDate: start,
            nextPaymentDate: nextPayment,
            category
        });

        const subscription = await newSubscription.save();
        res.json(subscription);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/subscriptions/:id
// @desc    Delete subscription
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ msg: 'Subscription not found' });
        }

        // Check user
        if (subscription.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Subscription.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Subscription removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
