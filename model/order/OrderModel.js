const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const GstModel = require('./GstModel');
const ScrapModel = require('./ScrapModel');
const PaymentModel = require('./PaymentModel');
const OrderItemModel = require('./OrderItemModel');


const OrderSchema = new mongoose.Schema({
    orderId: {
        type: Number
    },
    items: [OrderItemModel.schema],
    netAmmount: {
        type: Number,
        required: true
    },
    gst: [GstModel.schema],
    scrap: ScrapModel.schema,
    payment: PaymentModel.schema,
    receipt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'receipts'
    },
    totalAmmount: {
        type: Number,
        required: true
    },
    scrapAmmount: {
        type: Number,
        required: true
    },
    finalAmmount: {
        type: Number,
        required: true
    },
    kasar: {
        type: Number,
        default: 0
    },
    billOutstanding: {
        type: Number,
        required: true
    },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'parties'
    },
    partyPreBalance: {
        type: Number,
        required: true
    },
    partyPostBalance: {
        type: Number,
        required: true
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
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    invalidated: {
        type: Boolean,
    }
});

OrderSchema.plugin(AutoIncrement, { id: 'order_seq', inc_field: 'orderId' })

module.exports = OrderModel = mongoose.model('order', OrderSchema);
