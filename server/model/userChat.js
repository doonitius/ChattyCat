const mongoose = require('mongoose');

const userChatSchema = mongoose.Schema({
    chatVerify: [{
        chatID: String,
        chatName: String
    }],
    employeeID: { 
        type: String
    }
})

module.exports = mongoose.model('userChat', userChatSchema);