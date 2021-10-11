const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userID: {
        type: String,
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
        type: String,
        require: true
    },
    statusID: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    positionID: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('profile', profileSchema);