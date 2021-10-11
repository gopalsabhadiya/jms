const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({

    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'businesses',
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    item: {
        type: Number,
        default: 0
    },
    party: {
        type: Number,
        default: 0
    },
    receipt: {
        type: Number,
        default: 0
    }
});

module.exports = CounterModel = mongoose.model('counter', CounterSchema);