const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send("No token");
    }
    console.log(token)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(400).send("Invalid token");
        }
        next()
    })

}

module.exports = verifyToken;