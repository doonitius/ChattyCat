const mongoose = require('mongoose');

const newMessageSchema = mongoose.Schema({
    chatID: {
        type: String
    },
    text: {
        type: String
    },
    sender: {
        type: String
    },
    time: {
        type: Date
    }
})

module.exports = mongoose.model('newMessage', newMessageSchema);