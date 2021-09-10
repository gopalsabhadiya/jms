const mongoose = require('mongoose');
const { PartyTypeEnum } = require('../../util/enum');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const PartySchema = new mongoose.Schema({
    partyId: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    gstin: {
        type: String,
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

PartySchema.plugin(AutoIncrement, { id: 'party_seq', inc_field: 'partyId' });

PartySchema.statics = {
    search: function (q, business, callback) {
        console.log("Searching for:", q);
        return this.find({
            business: mongoose.Types.ObjectId(business),
            $or: [
                { 'name': new RegExp(q, 'gi') },
                { 'contactNo': new RegExp(q, 'gi') },
            ]
        }, callback).select({ 'name': 1, 'contactNo': 1, 'partyId': 1 });
    }
}

module.exports = PartyModel = mongoose.model('party', PartySchema);