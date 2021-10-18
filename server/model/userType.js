const mongoose = require('mongoose');

const userTypeSchema = mongoose.Schema({
    userTypeName: {
        type: String,
        required: true
    },
    userTypeID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('userType', userTypeSchema);