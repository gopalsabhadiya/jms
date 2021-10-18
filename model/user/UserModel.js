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
    date: {
        type: Date,
        default: Date.now
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
    }
});

module.exports = UserModel = mongoose.model('user', UserSchema);