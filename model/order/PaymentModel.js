const mongoose = require('mongoose');
const { PaymentTypeEnum } = require('../../util/enum');

const CheckSchema = new mongoose.Schema({
    bank: {
        type: String,
    },
    ammount: {
        type: Number,
        required: true,
    },
    checkNumber: {
        type: Number,
        default: 0
    },
    panNo: {
        type: String
    },
    aadharNo: {
        type: Number
    },
    type: {
        type: String,
        enum: Object.values(PaymentTypeEnum),
        required: true
    },
});

module.exports = CheckModel = mongoose.model('check', CheckSchema);
