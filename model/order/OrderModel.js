const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const GstModel = require('./GstModel');
const ScrapModel = require('./ScrapModel');
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
    fulfilled: {
        type: Boolean,
        required: true,
        default: false
    },
    receipts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'receipts'
    }],
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
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
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

OrderSchema.statics = {
    updateReceipt: function (orderId, receiptId, callback) {
        return this.findByIdAndUpdate(orderId, { $push: { receipts: receiptId } }, callback);
    }
}

OrderSchema.plugin(AutoIncrement, { id: 'order_seq', inc_field: 'orderId' })

module.exports = OrderModel = mongoose.model('order', OrderSchema);
