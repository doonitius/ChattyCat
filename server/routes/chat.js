const {verifyToken,
    getRefreshTokens, 
    setRefreshTokens,
    logout} = require('../middleware/auth')
const controller = require('../controller/chat.controller')

module.exports = function (app) {
    app.get('/chat', getRefreshTokens, verifyToken, controller.allChat);
    app.get('/chat/past', controller.pastChat);
}