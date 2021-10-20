const userPass = require('../model/userNamePass')
const profile = require('../model/profile')
const addressData = require('../model/address')
const mongoose = require('mongoose')
const { findOneAndUpdate } = require('../model/profile')
//mongoose.set('useFindAndModify', false)
//const getUser = require('../middleware/auth')

async function change() {
    const token = req.headers['auth-token'];
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    return user;
}

exports.edit = async (req, res) => {
    const validName = change();
    profile.findOneAndUpdate(validName, { 
        $set: { 
            employeeID: req.body.employeeID,
            userFName: req.body.userFName,
            userLName: req.body.userLName
        }
    }, function(err) {
        if (err) {
            return res.status(500).send({Error: "eror"})
        }
        console.log("ok");
        return res.status(200).send({ message: "Edit success" });
    })
}
