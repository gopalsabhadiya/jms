const mongoose = require('mongoose');
const ExtraChargablesModel = require('../order/ExtraChargablesModel');
const LabourModel = require('../order/LabourModel');
const { ItemQueriesPlugin } = require('./plugin/ItemPlugin');

const ItemSchema = new mongoose.Schema({
    itemId: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    grossWeight: {
        type: Number,
        required: true,
    },
    netWeight: {
        type: Number,
        required: true,
    },
    carat: {
        type: Number,
    },
    labour: LabourModel.schema,
    itemAmmount: {
        type: Number,
    },
    netAmmount: {
        type: Number,
    },
    stockPieces: {
        type: Number,
        default: 0
    },
    extras: [ExtraChargablesModel.schema],
    huid: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'businesses',
        required: true
    }

});

ItemSchema.plugin(ItemQueriesPlugin);

module.exports = ItemModel = mongoose.model('item', ItemSchema);
