const controller = require('../controller/profile.controller')
const {verifyToken,
    getRefreshTokens
    } = require('../middleware/auth')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/images');
    },
    filename: function (req, file, callback) {
        callback(null, "EM006.jpg");
    }
});

// const filter = (req, file, callback) => {
//     if (file.mimeType === 'image/jpg' || file.mimeType === 'image/png') 
//         callback(null, true);
//     else
//         callback(null, false);

// }

const upload = multer({
    storage: storage,
    limit: {
        fieldSize: 1024 * 1024 * 6
    }
    // fileFilter: filter
});

module.exports = function (app) {
    app.post('/profile/edit', getRefreshTokens, verifyToken, controller.edit)
    app.post('/profile/add/image', getRefreshTokens, verifyToken, upload.single("img"), controller.addImage)
    app.get('/profile/view', getRefreshTokens, verifyToken, controller.view)
    app.post('/profile/viewOther', getRefreshTokens, verifyToken, controller.viewOther)
}