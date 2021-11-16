const message = require('../model/message')
const userChat = require('../model/userChat')
const chatInfo = require('../model/chatInfo')

///////////////////////////////////////////
exports.allChat = async (req, res) => {
    var nomessage = [{text : " ", time: new Date}];
    var userChatVerify = await userChat.findOne({employeeID: req.body.employeeID}, { "_id": 0, "__v": 0, "employeeID": 0 });
    var checkGroup = await userChat.findOne({employeeID: req.body.employeeID})
    if(!userChatVerify){ res.status(400).send({messsage: "no chat"});}
    var chatID = [];
    var empID = [];
    for (var i = 0; i < checkGroup.chatVerify.length; i++) {
        if (checkGroup.chatVerify[i].isGroup == false) {
            chatID.push(checkGroup.chatVerify[i].chatID);
        }
    }
    for (var i = 0; i < chatID.length; i++) {
        const emID = await chatInfo.findOne({_id: chatID[i]}, {member: { $slice: 1}})
        empID.push(emID.member[0].employeeID);
    }
    console.log(empID);
    for (var i = 0; i < userChatVerify.chatVerify.length; i++) {
        const chatinfo = await chatInfo.findOne({_id: userChatVerify.chatVerify[i].chatID});
        if(chatinfo === undefined) {console.log("sdfsdf");continue;}
        if (await chatinfo.previewChat.length === 0){
            Object.assign(chatinfo.previewChat, nomessage);
        } 
        Object.keys(userChatVerify.chatVerify[i]).map(
            function(object){
                userChatVerify.chatVerify[i][object]["previewChat"] = chatinfo.previewChat
            }
        );
    }
    getAllChat = userChatVerify.chatVerify;
    return res.status(200).send({ getAllChat });
}
