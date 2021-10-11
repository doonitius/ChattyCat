const mongoose = require('mongoose');

const userType = mongoose.Schema({
    userTypeName: {
        type: String,
        required: true
    },
    
})