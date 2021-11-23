const message = require('../model/message')
const userChat = require('../model/userChat')
const chatInfo = require('../model/chatInfo')
const userNamePass = require('../model/userNamePass')

exports.allChat = async (req, res) => {
    var nomessage = [{text : " ", time: new Date}];
    var noEmpID = "-";
    var userChatVerify = await userChat.findOne({employeeID: req.body.employeeID}, { "_id": 0, "__v": 0, "employeeID": 0 });

    if (!userChatVerify) 
        return res.status(400).send({messsage: "no chat"});

    for (var i = 0; i < userChatVerify.chatVerify.length; i++) 
    {
        const chatinfo = await chatInfo.findOne({_id: userChatVerify.chatVerify[i].chatID});
        if(chatinfo === undefined) 
            continue;

        if(!userChatVerify.chatVerify[i].isGroup)
        {
            const findEmpID = await userNamePass.findOne({userName: userChatVerify.chatVerify[i].chatName}, {"password": 0, "_id": 0, "__v": 0});
            if(await findEmpID === undefined)
            {
                var foundEmpID = noEmpID;
                console.log("not found" + foundEmpID);
            }
            else 
                var foundEmpID = findEmpID.employeeID;
        }
        else
            var foundEmpID = noEmpID;

        Object.keys(userChatVerify.chatVerify[i]).map(
            function(object){
                userChatVerify.chatVerify[i][object]["employeeID"] = foundEmpID;
            }
        );

        if (await chatinfo.previewChat.length === 0)
            Object.assign(chatinfo.previewChat, nomessage);

        Object.keys(userChatVerify.chatVerify[i]).map(
            function(object){
                userChatVerify.chatVerify[i][object]["previewChat"] = chatinfo.previewChat
            }
        );
    }
    getAllChat = userChatVerify.chatVerify;
    return res.status(200).send({ getAllChat });
}
