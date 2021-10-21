const profile = require('../model/profile')
const jwt = require('jsonwebtoken');
const addressData = require('../model/address')
// const mongoose = require('mongoose')
// const { findOneAndUpdate } = require('../model/profile')
//const mongoose = require('mongoose')
//const { findOneAndUpdate } = require('../model/profile')
//mongoose.set('useFindAndModify', false)
//const getUser = require('../middleware/auth')

async function change(re) {
    const token = re.headers['auth-token'];
    const employee = jwt.verify(token, process.env.TOKEN_SECRET);
    const realEmployee = employee.employeeID;
    return realEmployee;
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
}

exports.edit = async (req, res) => {
    const re = req;
    const response = res;
    const validEmployee = change(re);
    await editProfile(validEmployee, re, response);
    await editAddress(validEmployee, re, response);
}

exports.view = async (req, res) => {
    const validEmployee = change(req);
    let [emp] = Object(validEmployee);
    console.log(emp);
    // const viewProfile = await profile.findOne({employeeID: emp}, { "_id": 0, "__v": 0 });
    // const viewAddress = await addressData.findOne({employeeID: emp}, { "_id": 0, "__v": 0, "employeeID": 0 });
    // if (!viewProfile || !viewAddress) {
    //     return res.status(404).send({ message: "Can't find profile or address"})
    // } 
    // try {
    //     res.status(200).send(viewProfile, viewAddress);
    // } catch (err) { 
    //     res.status(400).send(err); 
    // }
}