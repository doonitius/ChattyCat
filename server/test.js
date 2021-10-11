const express = require('express');
const mongoose = require('mongoose');
const profile = require('./model/profile');
const route = express.Router();


route.post('/', async(req, res) => {
    console.log('Sending');
    const profileInfo = new profile({
        userID: req.body.userID,
        userFName: req.body.userFName,
        userLName: req.body.userLName,
        tel: req.body.tel,
        departmentID: req.body.departmentID,
        statusID: req.body.statusID,
        email: req.body.email,
        positionID: req.body.positionID
    });
    try {
        const saveProfile = await profileInfo.save();
        res.send(saveProfile);
    } catch (err) {
        res.send("error");
    }
})

module.exports = route;