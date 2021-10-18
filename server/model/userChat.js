const mongoose = require('mongoose');

const userChatSchema = mongoose.Schema({
    chatID: {
        type: String,
        required: true
    },
    employeeID: { 
        type: String,
        required: true
    }
})

module.exports = mongoose.model('userChat', userChatSchema);