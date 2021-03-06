const userPass = require('../model/userNamePass')
const userChat = require('../model/userChat')
const chatInfo = require('../model/chatInfo')

// This function use to find all the user in the app //
// and list of the group that user are in //
exports.home = async (req, res) => {
    const user = await userPass.find({employeeID: {$ne: req.body.employeeID}}, { "_id": 0, "__v": 0, "password": 0})
    const group = await userChat.findOne({employeeID: req.body.employeeID})
    if (group == null) 
    {
        var sendGroup = [];
        return res.status(200).send({user,sendGroup});
    }
    for (var i = 0; i < group.chatVerify.length; i++)
    {
        if (!group.chatVerify[i].isGroup)
        {
            console.log(group.chatVerify[i]);
            group.chatVerify.splice(i, 1);
            i = i - 1;
        }
    }
    var sendGroup = group.chatVerify;
    console.log("-----------------");
    console.log(sendGroup);
    try {
        return res.status(200).send({user,sendGroup});
    } catch (err) {
        return res.status(500).send({message: "Error"})
    }
}

// function to create document in database that list
// chat of the user //
async function createUserChat (emp) {
    const inChat = new userChat ({employeeID: emp})
    try {
        const checkChat = await inChat.save();
        return checkChat;
    } catch (err) {
        return false;
    }
}

// function to create document in database that store //
// information about the chat of user with another user //
async function createChat(req) {
    const chat = new chatInfo ({
        member: [{employeeID : req.body.receiverID }],
        createrID: req.body.employeeID,
        isGroup: false,
        chatName: req.body.chatName
    })
    try {
        const createdChat = await chat.save();
        var mem = {employeeID: req.body.employeeID};
        const updateChat = await chatInfo.findOneAndUpdate({_id: createdChat._id },
            {$push : {member: mem}})
        return updateChat;
    } catch (err) {
        return false;
    }
}

// function to add chat to the list of user //
async function addChatOne (req, check) {
    try {
        var veri = {chatID: check._id, chatName: req.body.chatName, isGroup: false };
        const validVeri = await userChat.findOneAndUpdate({employeeID: req.body.employeeID},
            {$push: { chatVerify: veri}})
        return validVeri;
    } catch (err) {
        return false;
    }
}

// function to add chat to the list of another user // 
async function addChatTwo (req, check) {
    const checkName = await userPass.findOne({employeeID: req.body.employeeID})
    var name = checkName.userName;
    try {
        var veri = {chatID: check._id, chatName: name, isGroup: false };
        const validVeri = await userChat.findOneAndUpdate({employeeID: req.body.receiverID},
            {$push: { chatVerify: veri}})
        return validVeri;
    } catch (err) {
        return false;
    }
}

// function to add chat to the list of two user //
async function addChatVerify (req, check) {
    var addedChatOne = await addChatOne(req,check);
    var addedChatTwo = await addChatTwo(req,check);
    if (addedChatOne && addedChatTwo) 
        return 1;
    else 
        return 0; 
}

// This function use to find chat in the list of user //
// and add employeeID of another user to the object //
async function chatVerify (req) {
    var valid = await userChat.findOne({employeeID: req.body.employeeID});
    for (var i = 0; i < valid.chatVerify.length; i++) 
    {
        if (valid.chatVerify[i].chatName == req.body.chatName)
        {
            Object.keys(valid.chatVerify[i]).map(
                function(object){
                    valid.chatVerify[i][object]["employeeID"] = req.body.receiverID;
                }
            );
            var send = valid.chatVerify[i];
        }
    }
    return send; 
}

// function to check if the users have chat list or not //
// if not create for them and send information of that chat //
// to front-end // 
exports.indivChat = async (req, res) => {
    var checkChatOne = await userChat.findOne({employeeID: req.body.employeeID})
    var checkChatTwo = await userChat.findOne({employeeID: req.body.receiverID})
    if (!checkChatOne) 
    {
        var validCreate = await createUserChat(req.body.employeeID);
        checkChatOne = validCreate;
    }
    if (!checkChatTwo) 
    {
        var validCreateTwo = await createUserChat(req.body.receiverID)
        checkChatTwo = validCreateTwo;
    }
    var valid = await userChat.findOne({employeeID: req.body.employeeID, chatVerify: {$elemMatch: {chatName: req.body.chatName}}});            
    if (!valid) 
    {
        var validGroup = await createChat(req);  
        if (checkChatOne && checkChatTwo && validGroup) 
        {                 
            var validAdd = await addChatVerify(req, validGroup); 
            if (validAdd) 
            {
                var send = await chatVerify(req);
                return res.status(200).send(send);
            }
            return res.status(400).send({message: "Error add rec"})
        }
        else 
            return res.status(400).send({message: "Errrrrr"})
    }
    else 
    {
        var send = await chatVerify(req);
        return res.status(200).send(send);
    }
}

// The function that use to find users that are similar to what //
// user input and the user's groups that are similar to the input//
exports.search = async (req, res) => { 
    let groups = [];
    const user = await userPass.findOne({employeeID: req.body.employeeID})
    const searchName = await userPass.find({userName: {$regex: req.body.targetName,$options: 'i'}}, 
                                        {"userName": 1, "employeeID": 1, "_id": 0});
    for (var i = 0; i < searchName.length; i++) 
    {
        if (searchName[i].userName == user.userName) 
            searchName.splice(i, 1);
    }
    const searchGroup = await chatInfo.find({chatName: { $regex: req.body.targetName,$options: 'i'}, isGroup: true}, {"chatName": 1});
    const userGroup = await userChat.findOne({employeeID: req.body.employeeID}, {chatVerify: {"_id": 0}});
    if (userGroup == null || userGroup.chatVerify.length == 0) 
    {
        return res.status(200).send({searchName,groups});
    }
    // console.log(userGroup.chatVerify);
    for (var i = 0; i < userGroup.chatVerify.length; i++) 
    {
        for (var j = 0; j < searchGroup.length; j++) 
        {
            if (userGroup.chatVerify[i].isGroup == true && searchGroup[j].chatName == userGroup.chatVerify[i].chatName) 
                // console.log(userGroup.chatVerify[i].chatID);
                groups.push(userGroup.chatVerify[i]);
        }
    }
    try {
        console.log(groups);
        return res.status(200).send({searchName, groups});
    } catch {
        return res.status(400).send({message: "Erorr"});
    }
}