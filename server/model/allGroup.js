const mongoose = require('mongoose')

const allGruoupSchema = mongoose.Schema({
    chatID: {
        type: String,
        required: true
    },
    chatName: {
        type: String,
        required: true
    }
})

moduel.exports = mongoose.model('groups', allGruoupSchema);