const jwt = require('jsonwebtoken');

const validateToken = async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error('Invalid authorization');
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET);

}

module.exports = { validateToken };