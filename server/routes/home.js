const controller = require('../controller/home.controller')
const verifyToken = require('../middleware/auth')

module.exports = function (app) {
    app.get('/home/origin', verifyToken, controller.home);
}