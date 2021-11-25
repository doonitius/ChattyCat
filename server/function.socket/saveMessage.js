const chatInfo = require('../model/chatInfo');
const userPass = require('../model/userNamePass');
const newChatMessage = require('../model/newMessage');

// function to store the lastest chat message in //
// chat information database //
async function saveToPreview (user, msg){
    var utc = new Date();
    utc.setHours( utc.getHours() + 7);
    try{
        var text = {text: msg, time: utc};
        await chatInfo.findOneAndUpdate({_id: user.room},{$set: {previewChat: text}});
    } catch(err){
        throw err;
    }
}

// function to store new message in the database //
async function saveNewMessage(user, msg) {
    var utc = new Date();
    utc.setHours( utc.getHours() + 7);
    const realUser = await userPass.findOne({employeeID: user.username});
    var newMes = msg;
    const newMessage = new newChatMessage ({
        text: msg,
        sender: realUser.userName,
        time: utc,
        chatID: user.room
    });
    try{
        await newMessage.save();
        await saveToPreview(user, msg);
        return newMes;
    } catch (err) {
        return (err);
    }
}

module.exports = {
    saveToPreview,
    saveNewMessage
};