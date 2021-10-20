const profile = require('../model/profile')
const addressData = require('../model/address')
const mongoose = require('mongoose')
const { findOneAndUpdate } = require('../model/profile')
const jwt = require('jsonwebtoken')
//mongoose.set('useFindAndModify', false)
//const getUser = require('../middleware/auth')

async function change(re) {
    const token = re.headers['auth-token'];
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    return user;
}

async function editProfile(user, re, res) {
    try {
        await profile.findOneAndUpdate(user, { 
            $set: { 
                userFName: re.body.userFName,
                userLName: re.body.userLName,
                tel: re.body.tel,
                email: re.body.email
            }
        })
    } catch (err) {
        return res.status(400).send({ message: "Error can't edit profile" })
    }
}

async function editAddress(user, re, res) {
    try {
        await addressData.findOneAndUpdate(user, { 
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
    const re = req;
    const response = res;
    const validName = change(re);
    await editProfile(validName, re, response);
    await editAddress(validName, re, response);
}