const userChat = require('../model/userChat')
const chatInfo = require('../model/chatInfo')
const userPass = require('../model/userNamePass')

// function to create document in database that list
// chat of the user //
// duplicate //
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

// function to create document in database that store //
// information about the group chat //
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

// function to add group into the chat list of the user // 
async function addChatVerify(req, group) {
    var validUserChat = await userChat.findOne({employeeID: req.body.employeeID})
    if (!validUserChat) 
        var validCreate = await createUserChat(req.body.employeeID);
    
    if (validCreate || validUserChat) 
    {
        try {
            var veri = {chatID: group._id, chatName: req.body.chatName, isGroup: true };
            const validVeri = await userChat.findOneAndUpdate({employeeID: req.body.employeeID},
                {$push: { chatVerify: veri}})
            return validVeri;
        } catch (err) {
            return false;
        }
    }
    return false;
}

// This function use to find chat in the list of user// 
async function chatVerify (req) {
    var valid = await userChat.findOne({employeeID: req.body.employeeID});
    for (var i = 0; i < valid.chatVerify.length; i++) 
    {
        if (valid.chatVerify[i].chatName == req.body.chatName) 
            var send = valid.chatVerify[i];
    }
    return send; 
}

// This function use to create group chat for user //
exports.createGroup = async (req, res) => {
    var chatName = await chatInfo.findOne({chatName: req.body.chatName})
    if (chatName) 
        return res.status(400).send({message: "Already has this group!"});

    var group = await makeGroup(req);
    if (!group) 
        return res.status(400).send({message: "Error can't create group"});

    var validChatVeri = await addChatVerify(req, group);
    if (!validChatVeri) 
        return res.status(400).send({message: "Error can not make chat verify"})
    
    var send = await chatVerify(req);
    return res.status(200).send({send});
}

// This function use to search user that user wants to invite to the group //
exports.search = async (req, res) => {
    const user = await userPass.findOne({employeeID: req.body.employeeID})
    try {
        const searchName = await userPass.find({userName: {$regex: req.body.targetName,$options: 'i'}}, 
                                            {"userName": 1, "employeeID": 1, "_id": 0});
        for (var i = 0; i < searchName.length; i++) 
        {
            if (searchName[i].userName == user.userName) 
                searchName.splice(i, 1);
        }
        return res.status(200).send({searchName});
    } catch {
        return res.status(400).send({message: "Erorr"});
    }
}

async function findMember (req) {
    const existMember = await chatInfo.findOne({_id: req.body.chatID, member: {$elemMatch: {employeeID: req.body.targetID}}});
    if (!existMember) {
        return false;
    } else {
        return true;
    }
}

async function addMember (req) {
    try {
        var mem = {employeeID: req.body.targetID};
        const updateChat = await chatInfo.findOneAndUpdate({_id: req.body.chatID},
            {$push : {member: mem}})
        return updateChat;
    } catch (err) {
        return false;
    }
}

// This function use to invite the user to group chat //
exports.invite = async (req, res) => {
    var existMember = await findMember(req);  
    if (existMember) 
        return res.status(400).send({message: 'Member already exist!'});

    var userCh = await userChat.findOne({employeeID: req.body.targetID});
    if (!userCh) 
        var validCreate = await createUserChat(req.body.targetID);

    if (validCreate || userCh) 
    {
        var addedMember = await addMember(req);
        if (!addedMember) 
            return res.status(400).send({message: "Can't add member"});

        try {
            var veri = {chatID: req.body.chatID, chatName: req.body.chatName, isGroup: true };
            await userChat.findOneAndUpdate({employeeID: req.body.targetID},
                        {$push: { chatVerify: veri}})
            return res.status(200).send({messages: "Invite success!"});
        } catch (err) {
            return res.status(400).send({message: "Can't update user chat!!"});
        }
    }
    else 
        return res.status(400).send({message: "ERROR!!"});
}

// This function use to display all the members of the group //
exports.group = async (req, res) => {
    const chat = await chatInfo.findOne({_id: req.body.chatID}, {"member": 1})
    let members = [];
    for (var i = 0; i < chat.member.length; i++)
    {
        const member = await userPass.findOne({employeeID: chat.member[i].employeeID}, {"employeeID": 1, "userName": 1})
        members.push(member);
    }
    console.log(members)
    try {
        return res.status(200).send(members);
    } catch {
        return res.status(400).send({message: "Erorr"});
    }
}
