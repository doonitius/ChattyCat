const profile = require('../model/profile')
const userPass = require('../model/userNamePass')
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
    const validName = await userPass.findOne({userName: req.body.userName});
    if (validName) {
        return  res.status(400).send({ message: "Username already exist!" });
    }
    const profileInfo = new profile ({
        email: req.body.email,
        employeeID: req.body.employeeID
    });
    // try {
    //     const saveProfile = await profileInfo.save();
    //     res.status(200).send(saveProfile)
    // } catch (err) {
    //     res.status(400).send({ message })
    // }
    const hashedPass = await bcrypt.hash(req.body.password, 10)
    const userNamePass = new userPass ({
        userName: req.body.userName,
        password: hashedPass,
        employeeID: req.body.employeeID
    });
    try {
        const saveUserPass = await userNamePass.save();
        const saveProfile = await profileInfo.save();
        res.status(200).send({saveProfile, saveUserPass})
    } catch (err) {
        res.status(400).send({ message: "Error" })
    }
    
}