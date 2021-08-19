const mongoose = require('mongoose');
const ItemModel = require('./ItemModel');
const GstModel = require('./GstModel');
const ScrapModel = require('./ScrapModel');
const CheckModel = require('./CheckModel');


const OrderSchema = new mongoose.Schema({
    items: [ItemModel.schema],
    netAmmount: {
        type: Number,
        required: true
    },
    gst: [GstModel.schema],
    scrap: ScrapModel.schema,
    check: CheckModel.schema,
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
});

module.exports = OrderModel = mongoose.model('order', OrderSchema);
