const indivChat = require('../model/individualChat')
const chatInfo = require('../model/chatInfo')

async function createInChat (req) {
    const inChat = new indivChat ({
        employeeID: req.body.employeeID
    })
    try {
        checkChat = await inChat.save();
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
        return createdChat;
    } catch (err) {
        return false;
    }
}

async function addReceiver (req, check) {
    try {
        var indi = {chatID: check._id, receiverID: req.body.receiverID };
        const validRe = await indivChat.findOneAndUpdate({employeeID: req.body.employeeID},{
        $push: { individualChatList: indi}})
        console.log(validRe);
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
        return validRe;
    } catch (err) {
        return false;
    }
}

exports.indivChat = async (req, res) => {
    var checkChat = await indivChat.findOne({employeeID: req.body.employeeID})
    if (!checkChat) {
        var validCreate = await createInChat(req);
        checkChat = validCreate;
    }
    var valid = await indivChat.findOne({employeeID: req.body.employeeID, individualChatList: [{receiverID: req.body.receiverID}]}) 
    console.log(valid);
    if (!valid) {
        var validGroup = await createChat(req);         
        if (checkChat && validGroup) {                  
            var validAdd = await addReceiver(req, validGroup);
            console.log(validAdd);
            if (validAdd) {
                return res.status(200).send(validAdd)
            }
            return res.status(400).send({message: "Error add rec"})
        }
        else {return res.status(400).send({message: "Errrrrr"})}
    }
    else {
        console.log("EIEI")
        return res.status(200).send(valid)
    }
}