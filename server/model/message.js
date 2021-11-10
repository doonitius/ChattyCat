const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    chatID: {
        type: String
    },
    message: [{
        text: String,
        sender: String,
        time: Date
    }],
    count: {
        type: Number
    }
})

module.exports = mongoose.model('message', messageSchema);