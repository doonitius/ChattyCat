const controller = require('../controller/profile.controller')
const {verifyToken,
    getRefreshTokens
    } = require('../middleware/auth')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './uploads/images');
    },
    filename: function (request, file, callback) {
        callback(null, req.body.employeeID + ".jpg");
    }
});

const fileFilter = (request, file, callback) => {
    if (file.mimeType == 'image/jpeg' || file.mimeType == 'image/png') 
        callback(null, true);
    else
        callback(null, false);

}

const upload = multer({
    storage: storage,
    limit: {
        fieldSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter
});

module.exports = function (app) {
    app.post('/profile/edit', getRefreshTokens, verifyToken, controller.edit)
    app.patch('/profile/add/image', getRefreshTokens, verifyToken, upload.single("img"), controller.addImage)
    app.get('/profile/view', getRefreshTokens, verifyToken, controller.view)
    app.post('/profile/viewOther', getRefreshTokens, verifyToken, controller.viewOther)
}