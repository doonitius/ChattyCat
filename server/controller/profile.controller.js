const profile = require('../model/profile')
const jwt = require('jsonwebtoken');
const addressData = require('../model/address')
const mongoose = require('mongoose')
const { findOneAndUpdate } = require('../model/profile')
const jwt = require('jsonwebtoken')
//mongoose.set('useFindAndModify', false)
//const getUser = require('../middleware/auth')

<<<<<<< HEAD
async function change(req, res) {
    const token = req.headers['auth-token'];
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    return user;
}

exports.edit = async (req, res) => {
    console.log('edit', req)
    const validName = change(req);
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
=======
async function change(re) {
    const token = re.headers['auth-token'];
    const employee = jwt.verify(token, process.env.TOKEN_SECRET);
    return employee;
}

async function editProfile(employee, re, res) {
    try {
        await profile.findOneAndUpdate(employee, { 
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

async function editAddress(employee, re, res) {
    try {
        await addressData.findOneAndUpdate(employee, { 
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
>>>>>>> 02892282f805232e596eac4a0d37101609e4c711
}

exports.edit = async (req, res) => {
    const re = req;
    const response = res;
    const validEmployee = change(re);
    await editProfile(validEmployee, re, response);
    await editAddress(validEmployee, re, response);
}