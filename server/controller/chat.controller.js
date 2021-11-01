const message = require('../model/message')
const userChat = require('../model/userChat')
const chatInfo = require('../model/chatInfo')

async function chatIn (chatID) {
    const chat = await chatInfo.findOne({_id: chatID})
    return chat.previewChat;
}

exports.allChat = async (req, res) => {
    var userChatVerify = await userChat.findOne({employeeID: req.body.employeeID});
    var i = 0;
    var chatID = [];
    var chatName = [];
    var set = [];
    for (i = 0; i < userChatVerify.chatVerify.length; i++) {
        chatID[i] = userChatVerify.chatVerify[i].chatID;
        chatName[i] = userChatVerify.chatVerify[i].chatName;
    }
    var previewChat = [];
    for (i = 0; i < chatID.length; i++) {
        previewChat[i] = await chatIn(chatID[i]);
    }
    //console.log(previewChat[0][0].text);
    for (i = 0; i < chatID.length; i++) {
            if (previewChat[i][0] == undefined) {
                continue;
            }
            set.push([previewChat[i][0].text, previewChat[i][0].time,chatName[i], chatID[i]]);
            //set.push([chatName[i], chatID[i]]);
        }
    console.log("---------------------------");
    console.log(set);
    return res.send({set});
}
