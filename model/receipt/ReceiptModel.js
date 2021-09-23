const mongoose = require('mongoose');
const { PaymentTypeEnum } = require('../../util/enum');
const PaymentModel = require('./PaymentModel');
const { ReceiptQueriesPlugin } = require('./receiptPlugin');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const ReceiptSchema = new mongoose.Schema({
    receiptId: {
        type: Number
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
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
});

ReceiptSchema.plugin(AutoIncrement, { id: 'receipt_seq', inc_field: 'receiptId' });
ReceiptSchema.plugin(ReceiptQueriesPlugin);

module.exports = ReceiptModel = mongoose.model('receipt', ReceiptSchema);
