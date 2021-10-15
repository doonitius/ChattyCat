const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    zip : {
        type: String,
        required: true
    },
    city : {
        type: String,
        required: true
    },
    street : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('address', addressSchema);