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
    var newMes = {
        text: msg,
        sender: realUser.userName,
        userID: realUser.employeeID,
        time: utc
    }
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

async function pastMessage (user) {
    console.log("-------Function------");
    console.log(user);
    const messageChat = await chatMessage.findOne({chatID: user.room}, {"_id": 0});
    if(!messageChat){
        return message = "start conversation";
    }
    // if (messageChat.count >= 50) {
        
    // }
    var message = messageChat.message;
    await message.sort((a,b)=> a.time > b.time && 1 || -1)
    var e = JSON.stringify({message});
    ///50ล่าง
    return e;
}

module.exports = {
    saveToPreview,
    saveNewMessageRoom,
    savemessage,
    pastMessage
};