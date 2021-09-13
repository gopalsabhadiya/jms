const mongoose = require('mongoose');
const { PaymentTypeEnum } = require('../../util/enum');

const ReceiptSchema = new mongoose.Schema({
    bank: {
        type: String,
    },
    ammount: {
        type: Number,
        required: true,
    },
    checkNumber: {
        type: Number,
        default: 0
    },
    panNo: {
        type: String
    },
    aadharNo: {
        type: Number
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'businesses',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parties',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    },
    mode: {
        type: String,
        enum: Object.values(PaymentTypeEnum),
        required: true
    },
    invalidated: {
        type: Boolean
    }
});

module.exports = ReceiptModel = mongoose.model('receipt', ReceiptSchema);
