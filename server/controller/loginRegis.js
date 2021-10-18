const mongoose = require('mongoose')
const express = require('express')
const profile = require('../model/profile')
const userPass = require('../model/userNamePass')
const addressData = require('../model/address')

exports.register = async (req, res) => {
    const validName = await userPass.findOne({userName: req.body.userName});
    if (validName) {
        return  res.status(400).send({ message: "Username already exist!" });
    }
    else {
        const profileInfo = new profile ({
            userID: req.body.userID,
            userFName: req.body.userFName,
            userLName: req.body.userLName,
            tel: req.body.tel,
            departmentID: req.body.departmentID,
            email: req.body.email,
            positionID: req.body.positionID
        });
        const userNamePass = new userPass ({
            userName: req.body.userName,
            password: req.body.password
        });
        const address = new addressData ({
            zip: req.body.zip,
            city: req.body.body,
            street: req.body.street
        })
        try {
            const saveProfile = await profileInfo.save();
            const saveUserPass = await userNamePass.save();
            const saveAddress = await address.save();
            res.status(200).send(saveProfile, saveAddress, saveUserPass)
        } catch (err) {
            res.status(400).send({ message })};
    }
    
}