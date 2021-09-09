const mongoose = require('mongoose');
const LabourModel = require('./LabourModel');
const ExtraChargablesModel = require('./ExtraChargablesModel');

const OrderItemSchema = new mongoose.Schema({
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
    pieces: {
        type: Number,
        required: true
    },
    extras: [ExtraChargablesModel.schema],
    huid: {
        type: String,
    }

});

module.exports = OrderItemModel = mongoose.model('orderItem', OrderItemSchema);
