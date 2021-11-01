const controller = require('../controller/profile.controller')
const {verifyToken,
    getRefreshTokens, 
    setRefreshTokens} = require('../middleware/auth')

module.exports = function (app) {
    app.post('/profile/edit', getRefreshTokens, verifyToken, controller.edit)
    app.get('/profile/view', getRefreshTokens, verifyToken, controller.view)
    app.get('/profile/viewOther', getRefreshTokens, verifyToken, controller.viewOther)
}