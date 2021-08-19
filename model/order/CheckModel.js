const mongoose = require('mongoose');

const CheckSchema = new mongoose.Schema({
    bank: {
        type: String,
        required: true,
    },
    ammount: {
        type: Number,
        required: true,
    },
    checkNumber: {
        type: Number,
        required: true,
        default: 0
    },
    panNo: {
        type: String
    },
    aadharNo: {
        type: String
    },
});

module.exports = CheckModel = mongoose.model('check', CheckSchema);
