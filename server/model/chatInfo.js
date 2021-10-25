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
    previewChat : {
        type: String
    }
})

module.exports = mongoose.model('chatInfo', chatInfoSchema);