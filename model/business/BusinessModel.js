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
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }],
    bank: BankModel.schema,
    itemCollection: {
        type: Map,
        of: [String]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = BusinessModel = mongoose.model('business', BusinessSchema);