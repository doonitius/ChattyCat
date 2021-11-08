const mongoose = require('mongoose');

const userChatSchema = mongoose.Schema({
    chatVerify: [{
        chatID: String,
        chatName: String,
        isGroup: Boolean
    }],
    employeeID: { 
        type: String
    }
})

module.exports = mongoose.model('userChat', userChatSchema);