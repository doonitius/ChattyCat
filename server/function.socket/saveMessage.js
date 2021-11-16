const chatMessage = require('../model/message');
const chatInfo = require('../model/chatInfo');
const userPass = require('../model/userNamePass');

async function saveToPreview (user, msg){
    var utc = new Date();
    utc.setHours( utc.getHours() + 7);
    try{
        var text = {text: msg, time: utc};
        var getChatInfo = await chatInfo.findOneAndUpdate({_id: user.room},
            {$set: {previewChat: text}});
    } catch(err){
        throw err;
    }
}

async function addCount (user) {
    const count = await chatMessage.findOne({chatID: user.room}, {"count": 1});
    count.count = count.count + 1;
    await count.save();
    return;
}

async function saveNewMessageRoom(user, msg, realUser){
    var utc = new Date();
    utc.setHours( utc.getHours() + 7);
    const newMessage = new chatMessage({
        chatID: user.room,
        count: 1,
        message: [
            {
                text: msg,
                sender: realUser.userName,
                time: utc
            }
            ]
    });
    try {
        const savedMessage = await newMessage.save();
        console.log(savedMessage);
        return;
    } catch (err) {
        console.log(err)
        return;
    }
}

/// bug
async function savemessage(user, msg) {
    var utc = new Date();
    utc.setHours( utc.getHours() + 7);
    const realUser = await userPass.findOne({employeeID: user.username});
    console.log(realUser);
    var newMes = msg;

    // var eiei = JSON.stringify(newMes);
    try{
        var newMessage = {
            text: msg,
            sender: realUser.userName,
            time: utc
        }
        const messageRoomExist = await chatMessage.findOneAndUpdate({chatID: user.room},{
        $push: { message: newMessage}});

        if(!messageRoomExist){
            await saveNewMessageRoom(user, msg , realUser);
            await saveToPreview(user, msg);
            return newMes;
        }
        await addCount(user);
        await saveToPreview(user, msg);
        console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
        console.log(newMes);
        return newMes;
    } catch (err) {
        console.log(err);
        return(err);
    }
}

async function getMessage(c, count) {
    var message;
    var e;
    var element;
    var realMessage;
    if (count.count - c == 0) {
        message = await chatMessage.findOne({chatID: count.chatID}, {message : {$slice : -50}});
        realMessage = message.message; 
        c = c - 50;
        return e = JSON.stringify({realMessage,c});
    }
    else if (c > 50){
        element = count.count - c;
        num = Number(element);
        message = await chatMessage.findOne({chatID: count.chatID}, {message : {$slice : [-num, 50]}});
        realMessage = message.message;
        c = c - 50;
        return e = JSON.stringify({realMessage,c});
    }
    else {
        console.log(c);
        num = Number(c);
        console.log(num);
        message = await chatMessage.findOne({chatID: count.chatID}, {message : {$slice : num }});
        c = 0;
        realMessage = message.message;
        return e = JSON.stringify({realMessage,c});
    }
}

async function pastMessage (user, c) {
    console.log("-------Function------");
    console.log(user);
    const messageChat = await chatMessage.findOne({chatID: user.room}, {"_id": 0});
    var e;
    var message;
    if(!messageChat){
        return message = "start conversation";
    }
    var count = await chatMessage.findOne({chatID: user.room});
    if (c == -1){
        c = count.count;
    }
    if (count.count > 50) {
        message = getMessage(c, count);
        return message;
    }
    else {
        c = 0;
        message = messageChat.message;
        await message.sort((a,b)=> a.time > b.time && 1 || -1)
        return e = JSON.stringify({message,c});
    }
    ///50ล่าง ส่ง countด้วย
}

module.exports = {
    saveToPreview,
    saveNewMessageRoom,
    savemessage,
    pastMessage
};