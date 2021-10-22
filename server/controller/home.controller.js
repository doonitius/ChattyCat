const userPass = require('../model/userNamePass')
exports.home = async (req, res) => {
    const user = await userPass.find({}, { "_id": 0, "__v": 0, "password": 0, "employeeID": 0})
    //console.log(user)
    var i;
    var name = [];
    for (i = 0; i < user.length; i++) {
        name[i] = user[i].userName;
    }
    try {
        return res.status(200).send(name)
    } catch (err) {
        return res.status(500).send({message: "Error"})
    }
}