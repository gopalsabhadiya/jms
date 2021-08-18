const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    accountNo: {
        type: Number,
        required: true,
        unique: true
    },
    ifsc: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    }
});

module.exports = BankModel = mongoose.model('bank', BankSchema);