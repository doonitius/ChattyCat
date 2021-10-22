const profile = require('../model/profile')
const jwt = require('jsonwebtoken');
const addressData = require('../model/address')
//const mongoose = require('mongoose')
//mongoose.set('useFindAndModify', false)
//const getUser = require('../middleware/auth')

async function editProfile(req, res) {
    try {
        await profile.findOneAndUpdate({employeeID: req.employeeID}, { 
            $set: { 
                userFName: re.body.userFName,
                userLName: re.body.userLName,
                tel: re.body.tel,
                email: re.body.ema
            }
        })
    } catch (err) {
        console.log("Error")
        return res.status(400).send({ message: "Error can't edit profile" })
    }
}

async function editAddress(req, res) {
    try {
        await addressData.findOneAndUpdate({employeeID: req.employeeID}, { 
            $set: { 
                zip: re.body.zip,
                city: re.body.city,
                street: re.body.street
            }
        })
        return res.status(200).send({ message: "Success" })
    } catch (err) {
        return res.status(400).send({ message: "Error can't edit address" })
    }
}

exports.edit = async (req, res) => {
    await editProfile(req, res);
    await editAddress(re, res);
}

exports.view = async (req, res) => {
    const viewProfile = await profile.findOne({employeeID: req.employeeID}, { "_id": 0, "__v": 0 });
    const viewAddress = await addressData.findOne({employeeID: req.employeeID}, { "_id": 0, "__v": 0, "employeeID": 0 });
    if (!viewProfile || !viewAddress) {
        return res.status(404).send({ message: "Can't find profile or address"})
    } 
    try {
        res.status(200).send({viewProfile, viewAddress});
    } catch (err) { 
        res.status(400).send(err); 
    }
}