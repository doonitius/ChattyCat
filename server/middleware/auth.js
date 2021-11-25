const jwt = require('jsonwebtoken');

let refreshTokens = [];

// function to verify the token //
const verifyToken = (req, res, next) => {
    const token = req.body.token;
    if (!token) 
        return res.status(403).send("No token");
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(400).send("Invalid token");
        }
        req.body.employeeID = decoded.employeeID;
        next()
    })

}

// function to check if we have refresh-token or not //
const getRefreshTokens = (req, res, next) => {
    const refreshToken = req.headers['refresh-token'];
    if (refreshTokens == null) 
        return res.status(401).send("Error refresh null")
    if (!refreshTokens.includes(refreshToken)) 
        return res.status(403).send("Error not have this token")
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) 
            return res.send(400).send("Erorrrr");
        const payload = {employeeID: user.employeeID};
        const token = jwt.sign(payload, process.env.TOKEN_SECRET , {
            expiresIn: 300
        });
        req.body.token = token;
        next()
    })
}

function setRefreshTokens(refreshToken) {
    refreshTokens.push(refreshToken);
}

function logout(res, refreshToken) {
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(204).send({message: "delete refresh-token"})
}

module.exports = {verifyToken, getRefreshTokens, setRefreshTokens, logout};