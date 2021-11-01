const profile = require('../model/profile')
const userPass = require('../model/userNamePass')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const addressData = require('../model/address')
const {verifyToken,
    getRefreshTokens, 
    setRefreshTokens} = require('../middleware/auth')
require('dotenv').config()

exports.register = async (req, res) => {
    const validName = await userPass.findOne({userName: req.body.userName});
    if (validName) {
        return  res.status(400).send({ message: "Username already exist!" });
    }
    const profileInfo = new profile ({
        email: req.body.email,
        employeeID: req.body.employeeID
    });
    const hashedPass = await bcrypt.hash(req.body.password, 10)
    const address = new addressData({
        employeeID: req.body.employeeID,
    })
    const userNamePass = new userPass ({
        userName: req.body.userName,
        password: hashedPass,
        employeeID: req.body.employeeID
    });
    try {
        const saveAddress = await address.save();
        const saveUserPass = await userNamePass.save();
        const saveProfile = await profileInfo.save();
        return res.status(200).send({saveProfile, saveUserPass, saveAddress})
    } catch (err) {
        return res.status(400).send({ message: "Error" })
    }
}

exports.login = async (req, res) => {
    const validName = await userPass.findOne({userName: req.body.userName});
    if (!validName) {
        return res.status(400).send({Error: "Don't have this user!"})
    }
    const payload = { 
        employeeID: validName.employeeID
    };
    if (await bcrypt.compare(req.body.password, validName.password)) {
        const token = jwt.sign(payload, process.env.TOKEN_SECRET , {
            expiresIn: 600  
        });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
        setRefreshTokens(refreshToken);
        return res.status(200).header('auth-token', token).header('refresh-token',refreshToken).send({token,refreshToken})
    } else {
        res.status(400).send({Error: "Invalid password"})
    }
}