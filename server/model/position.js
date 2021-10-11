const mongoose = require('mongoose');

const positionSchema = mongoose.Schema({
    positionID: {
        type: String,
        required: true
    },
    departmentID: {
        type: String,
        required: true
    },
    positionName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('position', positionSchema);