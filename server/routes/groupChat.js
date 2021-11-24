const controller = require('../controller/group.controller')
const {verifyToken,
    getRefreshTokens
    } = require('../middleware/auth')

module.exports = function (app) {
    app.post('/group/create', getRefreshTokens, verifyToken, controller.createGroup);
    app.post('/group/invite',getRefreshTokens, verifyToken, controller.invite);
    app.post('/group/invite/search', getRefreshTokens, verifyToken, controller.search);
    app.get('/group', getRefreshTokens, verifyToken, controller.group)
}    