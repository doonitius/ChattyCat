const controller = require('../controller/loginRegis')
const {verifyToken,
    getRefreshTokens, 
    setRefreshTokens,
    logout} = require('../middleware/auth')

module.exports = function (app) {
    app.post('/login-register/register', controller.register);
    app.post('/login-register/login', controller.login);
    app.delete('/login-register/logout', controller.logout)
}