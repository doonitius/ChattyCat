const controller = require('../controller/home.controller')
const {verifyToken,
    getRefreshTokens, 
    setRefreshTokens,
    logout} = require('../middleware/auth')

module.exports = function (app) {
    app.get('/home/origin', getRefreshTokens, verifyToken, controller.home,);
    app.get('/home/chat', getRefreshTokens, verifyToken,  controller.indivChat);
    app.post('/home/search', getRefreshTokens, verifyToken, controller.search);
}