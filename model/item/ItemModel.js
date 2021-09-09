const mongoose = require('mongoose');
const ExtraChargablesModel = require('../order/ExtraChargablesModel');
const LabourModel = require('../order/LabourModel');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ItemSchema = new mongoose.Schema({
    itemId: {
        type: Number
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
    rate: {
        type: Number,
    },
    labour: LabourModel.schema,
    itemAmmount: {
        type: Number,
    },
    netAmmount: {
        type: Number,
    },
    pieces: {
        type: Number,
        required: true
    },
    extras: [ExtraChargablesModel.schema],
    huid: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }

});

ItemSchema.plugin(AutoIncrement, { id: 'itemSeq_seq', inc_field: 'itemId' })


module.exports = ItemModel = mongoose.model('item', ItemSchema);
