const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const Expense = require('../models/Expense');
const DataActivity = require('../models/DataActivity');
const auth = require('../middleware/auth');
const premium = require('../middleware/premium');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

// Middleware to verify token (referencing existing middleware logic if available, otherwise defining it inline or importing)
// Since we don't have the middleware file content visible, I'll rely on the one used in auth.js if I can find it, 
// OR I will re-implement a simple one here if needed, but better to use the existing one.
// The existing auth.js used a middleware function. let's check if there is a middleware file.
// I'll assume valid auth middleware is passed or available. 
// CHECK: The previous file view of auth.js showed specific auth middleware defined in the file.
// I should probably extract that middleware or copy it. 
// For now, I will assume I need to copy the logic or import it if better structured.
// Wait, I saw `const auth = (req, res, next) => ...` in auth.js. It wasn't exported.
// I should probably refactor auth.js to export it or create a middleware file. 
// BUT for speed and minimizing changes to existing working auth flow, I will create a middleware/auth.js file if it doesn't exist, 
// or validly duplicate the simple logic.
// Actually, looking at the file list, `middleware` directory wasn't shown.
// I will create `middleware/auth.js` to be clean.

// @route   GET api/data/export
// @desc    Export user expenses
// @access  Private & Premium
router.get('/export', [auth, premium], async (req, res) => {
    try {
        const { format } = req.query; // 'csv' or 'json'
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

        if (format === 'json') {
            await DataActivity.create({
                user: req.user.id,
                type: 'Export (JSON)',
                status: 'Completed',
                details: `${expenses.length} records`
            });
            return res.json(expenses);
        }

        if (format === 'csv') {
            const fields = ['title', 'amount', 'category', 'date', 'description'];
            const opts = { fields };
            const parser = new Parser(opts);
            const csvData = parser.parse(expenses);

            await DataActivity.create({
                user: req.user.id,
                type: 'Export (CSV)',
                status: 'Completed',
                details: `${expenses.length} records`
            });

            res.header('Content-Type', 'text/csv');
            res.attachment('expenses.csv');
            return res.send(csvData);
        }

        res.status(400).json({ msg: 'Invalid format' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/data/import
// @desc    Import expenses from CSV
// @access  Private
router.post('/import', [require('../middleware/auth'), upload.single('file')], async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Map CSV fields to Expense model
                // Assuming CSV headers: title, amount, category, date, description
                const expenses = results.map(row => ({
                    user: req.user.id,
                    title: row.title || row.Title || 'Untitled',
                    amount: parseFloat(row.amount || row.Amount || 0),
                    category: row.category || row.Category || 'Other',
                    date: row.date || row.Date || new Date(),
                    description: row.description || row.Description || ''
                }));

                if (expenses.length > 0) {
                    await Expense.insertMany(expenses);
                }

                await DataActivity.create({
                    user: req.user.id,
                    type: 'Import (CSV)',
                    status: 'Completed',
                    details: `${expenses.length} records imported`
                });

                // Cleanup uploaded file
                fs.unlinkSync(req.file.path);

                res.json({ msg: `${expenses.length} expenses imported successfully` });
            } catch (err) {
                console.error(err.message);
                await DataActivity.create({
                    user: req.user.id,
                    type: 'Import (CSV)',
                    status: 'Failed',
                    details: err.message
                });
                res.status(500).send('Server Error during import');
            }
        });
});

// @route   GET api/data/activity
// @desc    Get data activity logs
// @access  Private
router.get('/activity', require('../middleware/auth'), async (req, res) => {
    try {
        if (!req.user) {
            console.error('User not found in request');
            return res.status(500).json({ msg: 'Server Error: User not identified' });
        }
        const activity = await DataActivity.find({ user: req.user.id }).sort({ date: -1 }).limit(10);
        res.json(activity);
    } catch (err) {
        console.error('Activity Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;
