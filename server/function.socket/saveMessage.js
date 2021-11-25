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

// async function newGetMessage(c, count, room) {
//     var element;
//     if (count - c == 0) 
//     {
//         const message = await newChatMessage.find({chatID: room}).sort({"_id": -1}).limit(50);
//         for (var i = 0; i < message.length; i++)
//         {
//             socket.emit("loadUniqueChat", message[i]);
//             console.log(message[i]);
//         }
//         c = c - 50;
//         return c;
//     }
//     else if (c > 50)
//     {
//         element = count - c;
//         num = Number(element);
//         const message = await newChatMessage.find({chatID: room}).sort({"_id": -1}).skip(num).limit(50);
//         for (var i = 0; i < message.length; i++)
//         {
//             socket.emit("loadUniqueChat", message[i]);
//             console.log(message[i]);
//         }
//         c = c - 50;
//         return c;
//     }
//     else 
//     {
//         element = count - c;
//         num = Number(element);
//         const message = await chatMessage.findOne({chatID: room}).sort({"_id": -1}).skip(num);
//         for (var i = 0; i < message.length; i++)
//         {
//             socket.emit("loadUniqueChat", message[i]);
//             console.log(message[i]);
//         }
//         c = 0;
//         return c;
//     }
// }

// // aggregate แทน find?
// async function newPastMessage (user, c) {
//     console.log("-------Function------");
//     console.log(user);
//     const messageChat = await newChatMessage.find({chatID: user.room}, {"_id": 0, "__v": 0});
//     var message;
//     var room = user.room;
//     if(!messageChat)
//         return message = "start conversation";
//     var count = messageChat.length;
//     if (c == -1)
//         c = count;
//     if (count > 50) 
//     {
//         c = newGetMessage(c, count,room);
//         return c;
//     }
//     else 
//     {
//         c = 0;
//         for (var i = 0; i < messageChat.length; i++) 
//         {
//             socket.emit("loadUniqueChat", messageChat[i]);
//             console.log(messageChat[i]);
//         }
//         return c;
//     }
// }

module.exports = {
    saveToPreview,
    saveNewMessage
};