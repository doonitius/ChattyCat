const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    employeeID: {
        type: String
    },
    userFName: {
        type: String
    },
    userLName: {
        type: String
    },
    tel: {
        type: String
    },
    departmentID: {
        type: String
    },
    statusID: {
        type: String
    },
    email: {
        type: String
    },
    positionID: {
        type: String
    }
})

module.exports = mongoose.model('profile', profileSchema);