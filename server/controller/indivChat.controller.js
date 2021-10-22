const indivChat = require('../model/individualChat')

exports.indivChat = async (req, res) => {
    var checkChat = await indivChat.findOne({employeeID: req.body.employeeID})
    if (!checkChat) {
        const inChat = new indivChat ({
            employeeID: req.body.employeeID
        })
        try {
            checkChat = await inChat.save();
        } catch (err) {
            return res.status(404).send({Message: "can't create InChat"})
        }
    }
    var valid = checkChat.findOne({"individualChatList.receiverID": req.body.receiverID})
}