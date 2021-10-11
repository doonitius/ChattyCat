const mongoose = require('mongoose');

const statusSchema = mongoose.Schema({
    statusID: {
        type: String,
        required: true
    },
    statusName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('status', statusSchema);