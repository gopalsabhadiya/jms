const mongoose = require('mongoose');
const { PaymentModeEnum } = require('../../util/enum');

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
    type: {
        type: String,
        enum: Object.values(PaymentModeEnum),
        required: true
    },
    bank: {
        type: String
    },
    check: {
        type: Number
    },
    pan: {
        type: String
    },
    aadhar: {
        type: String
    },
    invalidated: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = PaymentModel = mongoose.model('payment', PaymentSchema);
