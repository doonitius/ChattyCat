const controller = require('../controller/loginRegis')

module.exports = function (app) {
    app.post('/login-register/register', controller.register);
    
}