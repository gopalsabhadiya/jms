const mongoose = require('mongoose');
const { PartyTypeEnum } = require('../../util/enum');

const PartySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactNo: {
        type: Number,
        required: true
    },
    gstin: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    },
    type: {
        type: String,
        enum: Object.values(PartyTypeEnum),
        required: true
    },
    panNo: {
        type: String
    },
    aadharNo: {
        type: String
    },
    order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = PartyModel = mongoose.model('party', PartySchema);