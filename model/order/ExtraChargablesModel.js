const mongoose = require('mongoose');
const { ExtraChargablesTypeEnum } = require('../../util/enum');

const ExtraChargablesSchema = new mongoose.Schema({
    rate: {
        type: Number,
    },
    pieces: {
        type: Number,
        required: true,
        default: 0
    },
    labourCharge: {
        type: Number
    },
    type: {
        type: String,
        enum: Object.values(ExtraChargablesTypeEnum),
        required: true
    },
});

module.exports = ExtraChargablesModel = mongoose.model('extraChargables', ExtraChargablesSchema);
