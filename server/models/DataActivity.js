const mongoose = require('mongoose');

const DataActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Export (CSV)', 'Export (JSON)', 'Import (CSV)'],
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'Failed'],
        default: 'Completed'
    },
    details: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DataActivity', DataActivitySchema);
