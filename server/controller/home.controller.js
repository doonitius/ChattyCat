const userPass = require('../model/userNamePass')
exports.home = async (req, res) => {
    const user = await userPass.find({}, { "_id": 0, "__v": 0, "password": 0})
    //console.log(user)
    var i;
    var name = [];
    var id = [];
    for (i = 0; i < user.length; i++) {
        name[i] = user[i].userName;
        id[i] = user[i].employeeID;
    }
    var set = [];
    for (i = 0; i < user.length; i++) {
        set.push([name[i], id[i]]);
    }
    console.log(set)
    try {
        return res.status(200).send(set)
    } catch (err) {
        return res.status(500).send({message: "Error"})
    }
}