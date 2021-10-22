const controller = require('../controller/indivChat.controller')
const verifyToken = require('../middleware/auth')

module.exports = function (app) {
    app.get('/indivChat', verifyToken, controller.indivChat);
}