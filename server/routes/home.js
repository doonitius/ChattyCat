const controller = require('../controller/home.controller')
const verifyToken = require('../middleware/auth')

module.exports = function (app) {
    app.get('/home/origin', verifyToken, controller.home);
    app.get('/home/chat', verifyToken, controller.indivChat);
    app.post('/home/search', verifyToken, controller.search);
}