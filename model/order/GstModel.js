const mongoose = require('mongoose');
const { GstTypeEnum } = require('../../util/enum');

const GstSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: String,
        enum: Object.values(GstTypeEnum),
        required: true
    },
    ammount: {
        type: Number,
        required: true
    },
});

module.exports = GstModel = mongoose.model('gst', GstSchema);
