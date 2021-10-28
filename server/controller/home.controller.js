const userPass = require('../model/userNamePass')
const userChat = require('../model/userChat')
const chatInfo = require('../model/chatInfo')

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

async function createUserChat (req) {
    const inChat = new userChat ({
        employeeID: req.body.employeeID
    })
    try {
        const checkChat = await inChat.save();
        console.log(checkChat);
        console.log("----------------------------------------")
        return checkChat;
    } catch (err) {
        return false;
    }
}

async function createChat(req) {
    const chat = new chatInfo ({
        member: [{
            employeeID : req.body.receiverID 
        }],
        createrID: req.body.employeeID
    })
    try {
        const createdChat = await chat.save();
        var mem = {employeeID: req.body.employeeID};
        const updateChat = await chatInfo.findOneAndUpdate({_id: createdChat._id },
            {$push : {member: mem}})
        console.log(updateChat);
        console.log("////////////////////////////////////////////////")
        return updateChat;
    } catch (err) {
        return false;
    }
}

async function addChatVerify (req, check) {
    try {
        var veri = {chatID: check._id, chatName: req.body.chatName };
        const validVeri = await userChat.findOneAndUpdate({employeeID: req.body.employeeID},{
        $push: { chatVerify: veri}})
        // console.log(validVeri);
        // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
        return validVeri;
    } catch (err) {
        return false;
    }
}

exports.indivChat = async (req, res) => {
    var checkChat = await userChat.findOne({employeeID: req.body.employeeID})
    if (!checkChat) {
        var validCreate = await createUserChat(req);
        checkChat = validCreate;
    }
    // {$elemMatch: {name: req.body.username}} ส่งuserName เป็น chatName และส่ง receiverIDมาด้วย
    var valid = await userChat.findOne({employeeID: req.body.employeeID, chatVerify: {$elemMatch: {chatName: req.body.chatName}}});
    console.log(valid);             
    if (!valid) {
        var validGroup = await createChat(req);  
        if (checkChat && validGroup) { 
            // ข้อมูลไปไม่ทัน                 
            var validAdd = await addChatVerify(req, validGroup);
            if (validAdd) {
                var send = await userChat.findOne({employeeID: req.body.employeeID, chatVerify: {$elemMatch: {chatName: req.body.chatName}}});
                console.log(send);
                return res.status(200).send(send.chatVerify);
            }
            return res.status(400).send({message: "Error add rec"})
        }
        else {return res.status(400).send({message: "Errrrrr"})}
    }
    else {
        return res.status(200).send(valid.chatVerify)
    }
}