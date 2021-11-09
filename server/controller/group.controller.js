const userChat = require('../model/userChat')
const chatInfo = require('../model/chatInfo')
const userPass = require('../model/userNamePass')

async function createUserChat (emp) {
    const inChat = new userChat ({
        employeeID: emp
    })
    try {
        const checkChat = await inChat.save();
        return checkChat;
    } catch (err) {
        return false;
    }
}

async function makeGroup(req) {
    const newGroup = new chatInfo({
        member: [{
        employeeID: req.body.employeeID
        }],
        createrID: req.body.employeeID,
        isGroup: true,
        chatName: req.body.chatName
    })
    try {
        const saveGroup = await newGroup.save();
        return saveGroup;
    } catch (err) {
        return false;
    }
}

async function addChatVerify(req, group) {
    var validUserChat = await userChat.findOne({employeeID: req.body.employeeID})
    if (!validUserChat) {
        var validCreate = await createUserChat(req.body.employeeID);
    }
    if (validCreate || validUserChat) {
        try {
            var veri = {chatID: group._id, chatName: req.body.chatName, isGroup: true };
            const validVeri = await userChat.findOneAndUpdate({employeeID: req.body.employeeID},{
            $push: { chatVerify: veri}})
            return validVeri;
        } catch (err) {
            return false;
        }
    }
    return false;
}

async function chatVerify (req) {
    var valid = await userChat.findOne({employeeID: req.body.employeeID});
    for (var i = 0; i < valid.chatVerify.length; i++) {
        if (valid.chatVerify[i].chatName == req.body.chatName) {
            var send = valid.chatVerify[i];
        }
    }
    return send; 
}

// passed
exports.createGroup = async (req, res) => {
    var chatName = await chatInfo.findOne({chatName: req.body.chatName})
    if (chatName) {
        return res.status(400).send({message: "Already has this group!"});
    }
    var group = await makeGroup(req);
    if (!group) {
        return res.status(400).send({message: "Error can't create group"});
    }
    var validChatVeri = await addChatVerify(req, group);
    if (!validChatVeri) {
        return res.status(400).send({message: "Error can not make chat verify"})
    }
    var send = await chatVerify(req);
    return res.status(200).send({send});
}

// passed
exports.search = async (req, res) => {
    const searchName = await userPass.find({userName: { $regex: req.body.targetName,$options: 'i'}}, {"userName": 1, "employeeID": 1, "_id": 0});
    try {
        return res.status(200).send({searchName});
    } catch {
        return res.status(400).send({message: "Erorr"});
    }
}

 // broken
exports.invite = async (req, res) => {
    var userCh = await userChat.findOne({employeeID: req.body.targetID})
    if (!userCh) {
        var validCreate = await createUserChat(req.body.targetID);
    }
    if (validCreate || userCh) {
        try {
            var veri = {chatID: req.body.chatID, chatName: req.body.chatName, isGroup: true };
            const validVeri = await userChat.findOneAndUpdate({employeeID: req.body.targetID},{
            $push: { chatVerify: veri}})
            return res.status(200).send(validVeri);
        } catch (err) {
            return res.status(400).send({message: "Can't update user chat!!"});
        }
    }
    return res.status(400).send({message: "ERROR!!"});
}   