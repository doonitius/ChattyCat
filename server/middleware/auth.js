const jwt = require('jsonwebtoken');

let refreshTokens = [];

const verifyToken = (req, res, next) => {
    const token = req.headers['auth-token'];
    if (!token) {
        return res.status(403).send("No token");
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(400).send("Invalid token");
        }
        req.body.employeeID = decoded.employeeID;
        next()
    })

}
// จะให้refreshตรงไหน
const getRefreshTokens = (req, res, next) => {
    const refreshToken = req.headers['refresh-token'];
    if (refreshTokens == null) {
        return res.status(401).send("Error")
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).send("Error")
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.send(400).send("Erorr");
        const payload = {employeeID: user.employeeID};
        const token = jwt.sign(payload, process.env.TOKEN_SECRET , {
            expiresIn: 600
        });
        res.status(200).header('auth-token', token)
        next()
    })
}

function setRefreshTokens(refreshToken) {
    refreshTokens.push(refreshToken);
}

module.exports = {verifyToken, getRefreshTokens, setRefreshTokens};