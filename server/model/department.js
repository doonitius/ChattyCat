const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    departmentID: {
        type: String,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('department', departmentSchema);