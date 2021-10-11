const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userID: {
        type: Number,
        require: true
    },
    userFName: {
        type: String,
        require: true
    },
    userLName: {
        type: String,
        require: true
    },
    tel: {
        type: String,
        require: true
    },
    departmentID: {
        type: Number,
        require: true
    },
    statusID: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    positionID: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('profile', profileSchema);