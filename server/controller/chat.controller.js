const message = require('../model/message')
const userChat = require('../model/userChat')
const chatInfo = require('../model/chatInfo')

exports.allChat = async (req, res) => {
    var nomessage = [{text : " ", time: new Date}];
    var userChatVerify = await userChat.findOne({employeeID: req.body.employeeID}, { "_id": 0, "__v": 0, "employeeID": 0 });
    if(!userChatVerify){ res.status(400).send({messsage: "no chat"});}
    for (var i = 0; i < userChatVerify.chatVerify.length; i++) {
        const chatinfo = await chatInfo.findOne({_id: userChatVerify.chatVerify[i].chatID});
        if(chatinfo === undefined) {console.log("sdfsdf");continue;}
        if (await chatinfo.previewChat.length === 0){
            // console.log(chatinfo.previewChat);
            // console.log("nononoon");
            Object.assign(chatinfo.previewChat, nomessage);
            // chatinfo.previewChat = " No ";
            // Object.keys(chatinfo.previewChat).map(
            //     function(object){
            //         chatinfo.previewChat[object]["text"] = nomessage;
            //     }
            // );
            //chatinfo.previewChat.text = nomessage;
            // console.log(chatinfo.previewChat);
        }
        
        // userChatVerify.chatVerify[i].previewChat = chatinfo.previewChat[0].text;
        // Object.assign(userChatVerify.chatVerify[i].previewChat, chatinfo.previewChat);
        Object.keys(userChatVerify.chatVerify[i]).map(
            function(object){
                userChatVerify.chatVerify[i][object]["previewChat"] = chatinfo.previewChat
            }
        );
        // console.log(typeof userChatVerify.chatVerify[i].previewChat);
        // console.log("+++++++++++++++++++++++++++++++++++")
        // console.log(userChatVerify.chatVerify[i].previewChat);
        // console.log(userChatVerify.chatVerify[i]);
        // console.log("+++++++++++++++++++++++++++++++++++")
        // json = JSON.stringify(userChatVerify.chatVerify[i]);
        // console.log(json);
    }
    // var i = 0;
    // var chatID = [];
    // var chatName = [];
    // var set = [];
    // for (i = 0; i < userChatVerify.chatVerify.length; i++) {
    //     chatID[i] = userChatVerify.chatVerify[i].chatID;
    //     chatName[i] = userChatVerify.chatVerify[i].chatName;
    // }
    // var previewChat = [];
    // for (i = 0; i < chatID.length; i++) {
    //     previewChat[i] = await chatIn(chatID[i]);
    // }
    // //console.log(previewChat[0][0].text);
    // for (i = 0; i < chatID.length; i++) {
    //         if (previewChat[i][0] == undefined) {
    //             continue;
    //         }
    //         set.push([previewChat[i][0].text, previewChat[i][0].time,chatName[i], chatID[i]]);
    //         //set.push([chatName[i], chatID[i]]);
    //     }
    // console.log("---------------------------");
    // console.log(set);
    // console.log({userChatVerify});
    // console.log(json(userChatVerify));
    getAllChat = userChatVerify.chatVerify;
    return res.status(200).send({ getAllChat });
}
