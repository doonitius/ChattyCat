const express = require('express');
const mongoose = require('mongoose');
const profile = require('/model/profile');
const route = express.Router();

route.post('/', async(req, res) => {
    const profileInfo = new profile({
        userID: req.body.userID,
        userFName: req.body.userFName,
        userLName: req.body.userLName,
    });
    const saveProfile = await profileInfo.save();
    res.json(saveProfile);
})

module.exports = route;