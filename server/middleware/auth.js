const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['auth-token'];

    if (!token) {
        return res.status(403).send("No token");
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(400).send("Invalid token");
        }
        next()
    })

}

const getUser = (req, res) => {
     const token = req.headers['auth-token'];
     const user = jwt.verify(token, process.env.TOKEN_SECRET);
    return user;
}

module.exports = verifyToken;