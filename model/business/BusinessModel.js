const mongoose = require('mongoose');
const BankModel = require('./BankModel');

const BusinessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    gstin: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactNo: [{
        type: Number,
        required: true
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'users'
    },
    bank: BankModel.schema,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = BusinessModel = mongoose.model('business', BusinessSchema);