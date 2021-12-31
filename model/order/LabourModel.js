const mongoose = require('mongoose');
const { LabourTypeEnum } = require('../../util/enum');

const LabourSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: String,
        enum: Object.values(LabourTypeEnum),
        required: true
    },
});

module.exports = LabourModel = mongoose.model('labour', LabourSchema);
