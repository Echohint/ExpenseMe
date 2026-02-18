const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');

// Middleware to verify token (duplicated here for simplicity, or could be extracted)
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// @route   GET api/expenses
// @desc    Get all users expenses (with filter/sort)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { category, sort, startDate, endDate } = req.query;
        let query = { user: req.user.id };

        if (category && category !== 'All Categories') {
            query.category = category;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        let expenses = Expense.find(query);

        if (sort === 'date_desc' || sort === 'Newest First') {
            expenses = expenses.sort({ date: -1 });
        } else if (sort === 'date_asc' || sort === 'Oldest First') {
            expenses = expenses.sort({ date: 1 });
        } else {
            expenses = expenses.sort({ date: -1 }); // Default
        }

        const result = await expenses.exec();
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, async (req, res) => {
    const { amount, category, description, date } = req.body;

    try {
        const newExpense = new Expense({
            amount,
            category,
            description,
            date,
            user: req.user.id,
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        // Ensure user owns expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await expense.deleteOne();
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
