const mongoose = require('mongoose');

const ScrapSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 0
    },
    netWeight: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true
    },
    netAmmount: {
        type: Number,
        required: true
    }

});

module.exports = ScrapModel = mongoose.model('scrap', ScrapSchema);
