const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'businesses'
    },
    authorization: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = UserModel = mongoose.model('user', UserSchema);