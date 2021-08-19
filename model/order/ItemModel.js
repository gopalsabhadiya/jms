const mongoose = require('mongoose');
const LabourModel = require('./LabourModel');
const ExtraChargablesModel = require('./ExtraChargablesModel');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 0
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
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    labour: LabourModel.schema,
    itemAmmount: {
        type: Number,
        required: true
    },
    netAmmount: {
        type: Number,
        required: true
    },
    extras: [ExtraChargablesModel.schema],
    huid: {
        type: String,
        required: true
    }

});

module.exports = ItemModel = mongoose.model('item', ItemSchema);
