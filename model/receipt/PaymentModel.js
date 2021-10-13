const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    ammount: {
        type: Number,
        requirede: true
    },
    invalidated: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = PaymentModel = mongoose.model('payment', PaymentSchema);
