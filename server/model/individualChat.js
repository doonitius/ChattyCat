const mongoose = require('mongoose');

const indiChatSchema = mongoose.Schema({
    employeeID: {
        type: String,
    },
    individualChatList: [{
        chatID : String,
        receiverID: String,
        previousMessage: String,
         }]
})

module.exports = mongoose.model('indivChat', indiChatSchema);