const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Food & Dining', 'Transportation', 'Utilities', 'Shopping', 'Health & Fitness', 'Travel', 'Personal Care', 'Education', 'Entertainment', 'Others'],
    },
    description: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Synced', 'Pending'],
        default: 'Synced',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Expense', expenseSchema);
