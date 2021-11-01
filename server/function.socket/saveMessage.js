const chatMessage = require('../model/message');
const chatInfo = require('../model/chatInfo')

async function saveToPreview (user, msg){
    var utc = new Date();
    utc.setHours( utc.getHours() + 7);
    try{
        var text = {text: msg, time: utc};
        var getChatInfo = await chatInfo.findOneAndUpdate({_id: user.room},
            {$set: {previewChat: text}});
        console.log(getChatInfo);
    } catch(err){
        throw err;
    }
}

async function saveNewMessageRoom(user, msg){
    var utc = new Date();
    var utcc = new Date();
    utc.setHours( utc.getHours() + 7);
    console.log(utcc, utc);
    const newMessage = new chatMessage({
    chatID: user.room,
    message: [
    {
        text: msg,
        sender: user.username,
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

async function savemessage(user, msg) {
    var utc = new Date();
    var utcc = new Date();
    utc.setHours( utc.getHours() + 7);
    console.log(utcc, utc);
    try{
        var newMessage = {
            text: msg,
            sender: user.username,
            time: utc
        }
        const messageRoomExist = await chatMessage.findOneAndUpdate({chatID: user.room},{
        $push: { message: newMessage}});

        if(!messageRoomExist){
            await saveNewMessageRoom(user, msg);
            await saveToPreview(user, msg);
            return;
        }
        await saveToPreview(user, msg);
        return;
    } catch (err) {
        console.log(err);
        return(err);
    }
}

module.exports = {
    saveToPreview,
    saveNewMessageRoom,
    savemessage
};