const mongoose = require('mongoose');

const GoldRateHistorySchema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true,
        default: 0
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'businesses',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    dateOnly: {
        type: Number,
        required: true
    }
});

module.exports = GoldRateHistoryModel = mongoose.model('gold_rate_history', GoldRateHistorySchema);