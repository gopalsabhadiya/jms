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
    date: {
        type: Date,
        default: Date.now
    }
});

PartySchema.plugin(AutoIncrement, { id: 'party_seq', inc_field: 'partyId' })

module.exports = PartyModel = mongoose.model('party', PartySchema);