const mongoose = require('mongoose');

const userChatSchema = mongoose.Schema({
    chatID: {
        type: String,
        required: true
    },
    userID: { 
        type: String,
        required: true
    }
})

module.exports = mongoose.model('userChat', userChatSchema);