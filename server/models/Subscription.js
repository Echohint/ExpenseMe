const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'INR',
    },
    billingCycle: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Yearly'],
        default: 'Monthly',
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    nextPaymentDate: {
        type: Date,
    },
    category: {
        type: String,
        default: 'Entertainment',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
