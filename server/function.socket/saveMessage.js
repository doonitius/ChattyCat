const chatMessage = require('../model/message');
const chatInfo = require('../model/chatInfo')

async function saveToPreview (user, msg){
    try{
        var text = {text: msg};
        var getChatInfo = await chatInfo.findOneAndUpdate({_id: user.room},
            {$set: {previewChat: text}});
        console.log(getChatInfo);
    } catch(err){
        throw err;
    }
}

async function saveNewMessageRoom(user, msg){
    const newMessage = new chatMessage({
    chatID: user.room,
    message: [
    {
        text: msg,
        sender: user.username,
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
    try{
        var newMessage = {
            text: msg,
            sender: user.username
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