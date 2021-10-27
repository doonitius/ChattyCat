const message = require('../model/message')
const indivChat = require('../model/individualChat')
const chatInfo = require('../model/chatInfo')

async function chatIn (chatID) {
    const chat = await chatInfo.findOne({_id: chatID})
    return chat.previewChat;
}

exports.allChat = async (req, res) => {
    var chat = await indivChat.findOne({employeeID: req.body.employeeID});
    // console.log("---------------------------")
    // console.log(chat.individualChatList[1].chatID);
    var i = 0;
    var chatIDFind = [];
    var receiverID = [];
    var set = [];
    for (i = 0; i < chat.individualChatList.length; i++) {
        chatIDFind[i] = chat.individualChatList[i].chatID;
        receiverID[i] = chat.individualChatList[i].receiverID;
    }
    // console.log("---------------------------");
    // console.log({chatID, receiverID});
    // for (i = 0; i < chat.individualChatList.length; i++) {
    //     set.push([chatID[i], receiverID[i]]);
    // }
    // // console.log("---------------------------");
    // console.log(set[0][0]);
    var chatID = [];
    for (i = 0; i < chatIDFind.length; i++) {
        chatID[i] = await chatIn(chatIDFind[i]);
    }
    console.log(chatID);
    for (i = 0; i < chatIDFind.length; i++) {
            set.push([chatID[i], receiverID[i]]);
        }
    console.log("---------------------------");
    console.log(set);
    return res.send(chat.individualChatList[1]);
}
