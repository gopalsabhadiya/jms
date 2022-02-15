const mongoose = require('mongoose');
const { PaymentTypeEnum } = require('../../util/enum');
const PaymentModel = require('./PaymentModel');
const { ReceiptQueriesPlugin } = require('./ReceiptPlugin/ReceiptPlugin');
const { PaymentModeEnum } = require('../../util/enum');

const ReceiptSchema = new mongoose.Schema({
    receiptId: {
        type: String
    },
    ammount: {
        type: Number,
        required: true
    },
    payments: [PaymentModel.schema],
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
    invalidated: {
        type: Boolean,
        default: false
    },
    paymentType: {
        type: String,
        enum: Object.values(PaymentTypeEnum),
        required: true
    },
    paymentMode: {
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
        type: Number
    },
    activeAmmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
});

ReceiptSchema.plugin(ReceiptQueriesPlugin);

module.exports = ReceiptModel = mongoose.model('receipt', ReceiptSchema);
