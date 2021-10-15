const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    chatID: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    isPin:{
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('message', messageSchema);