const controller = require('../controller/profile.controller')
const verifyToken = require('../middleware/auth')

module.exports = function (app) {
    app.post('/profile/edit', verifyToken, controller.edit)
    app.get('/profile/view', verifyToken, controller.view)
    app.get('/profile/viewOther', verifyToken, controller.viewOther)
}