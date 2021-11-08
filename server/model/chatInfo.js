const mongoose = require('mongoose');

const chatInfoSchema = mongoose.Schema({
    chatID: {
        type: String
    },
    member: [{
        employeeID: String
    }],
    chatName: { 
        type: String
    },
    createrID: {
        type: String 
    },
    isGroup: {
        type: Boolean
    },
    previewChat : [{
        text: String,
        time: Date
    }]
})

module.exports = mongoose.model('chatInfo', chatInfoSchema);