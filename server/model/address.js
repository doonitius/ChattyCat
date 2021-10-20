const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    employeeID: {
        type: String,
    },
    zip : {
        type: String,
    },
    city : {
        type: String,
    },
    street : {
        type: String,
    }
})

module.exports = mongoose.model('address', addressSchema);