const verifyToken = require('../middleware/auth')
const controller = require('../controller/chat.controller')

module.exports = function (app) {
    app.get('/chat', verifyToken, controller.allChat);
}