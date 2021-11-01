const {verifyToken,
    getRefreshTokens, 
    setRefreshTokens} = require('../middleware/auth')
const controller = require('../controller/chat.controller')

module.exports = function (app) {
    app.get('/chat', getRefreshTokens, verifyToken, controller.allChat);
}