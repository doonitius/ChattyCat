const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    // find array
    //member
    userType: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('member', memberSchema);