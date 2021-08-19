const mongoose = require('mongoose');
const { BalanceTypeEnum } = require('../../util/enum');


const BalanceSchema = new mongoose.Schema({
    ammount: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: Object.values(BalanceTypeEnum),
        required: true
    },
});

module.exports = BalanceModel = mongoose.model('balance', BalanceSchema);