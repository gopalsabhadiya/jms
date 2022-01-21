const mongoose = require('mongoose');
const { ExtraChargablesTypeEnum } = require('../../util/enum');

const ExtraChargablesSchema = new mongoose.Schema({
    rate: {
        type: Number,
    },
    pieces: {
        type: Number,
        default: 0
    },
    labourCharge: {
        type: Number
    },
    type: {
        type: String,
        required: true,
    },
});

module.exports = ExtraChargablesModel = mongoose.model('extraChargables', ExtraChargablesSchema);
