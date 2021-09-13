const mongoose = require('mongoose');
const { ItemStatus } = require('../../util/enum');
const ExtraChargablesModel = require('../order/ExtraChargablesModel');
const LabourModel = require('../order/LabourModel');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ItemSchema = new mongoose.Schema({
    itemId: {
        type: Number
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

ItemSchema.plugin(AutoIncrement, { id: 'itemSeq_seq', inc_field: 'itemId' })

ItemSchema.statics = {
    searchByString: function (q, business, callback) {
        return this.find({
            business: mongoose.Types.ObjectId(business),
            stockPieces: { $gt: 0 },
            $or: [
                { huid: new RegExp(q, 'gi') },
                { name: new RegExp(q, 'gi') },
            ]
        }, callback).select({ 'name': 1, 'huid': 1, 'itemId': 1 });
    },
    searchByItemId: function (q, business, callback) {
        return this.find({
            business: mongoose.Types.ObjectId(business),
            stockPieces: { $gt: 0 },
            "$expr": {
                "$regexMatch": {
                    "input": { "$toString": "$itemId" },
                    "regex": q
                }
            }
        }, callback).select({ 'name': 1, 'huid': 1, 'itemId': 1 });
    },

    search: function (q, business, callback) {
        if (isNaN(q)) {
            return this.searchByString(q, business, callback);
        }
        return this.searchByItemId(q, business, callback);
    }
}

module.exports = ItemModel = mongoose.model('item', ItemSchema);
