const mongoose = require('mongoose')

const userNamePassSchema = mongoose.Schema({
    userName : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    employeeID: {
        type: String,
        required: true
    }
}) 

module.exports = mongoose.model('userPass', userNamePassSchema);