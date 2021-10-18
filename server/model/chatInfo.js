const mongoose = require('mongoose');

const chatInfoSchema = mongoose.Schema({
    chatID: {
        type: String,
        required: true
    },
    // find array
    // member: {
    //     type: Array<String>,
    //     required: true
    // }
    chatName: { 
        type: String, 
        required: true
    },
    createrID: {
        type: String, 
        required: true
    },
    previewChat : {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('chatInfo', chatInfoSchema);