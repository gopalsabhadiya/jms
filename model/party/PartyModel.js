const mongoose = require('mongoose');
const { PartyTypeEnum } = require('../../util/enum');

const PartySchema = new mongoose.Schema({
    partyId: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    contactNo: {
        type: String,
        required: true
    },
    gstin: {
        type: String,
        unique: true,
        sparse: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
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
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'businesses',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

PartySchema.statics = {
    search: function (q, business, callback) {
        return this.find({
            business: mongoose.Types.ObjectId(business),
            $or: [
                { 'name': new RegExp(q, 'gi') },
                { 'contactNo': new RegExp(q, 'gi') },
            ]
        }, callback).select({ 'name': 1, 'contactNo': 1, 'partyId': 1, 'balance':1, "type":1 });
    }
}

module.exports = PartyModel = mongoose.model('party', PartySchema);