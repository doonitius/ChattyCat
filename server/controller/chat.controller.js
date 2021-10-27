const message = require('../model/message')
const indivChat = require('../model/individualChat')
const chatInfo = require('../model/chatInfo')


exports.allChat = async (req, res) => {
    var chat = await indivChat.findOne({employeeID: req.body.employeeID});
    console.log(chat);
}
