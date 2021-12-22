const jwt = require('jsonwebtoken');
const config = require('config');

const middleware = (req, res, next) => {
    //get token from header
    const token = req.header('x-auth-token');
    var jwtToken = req.cookies['jwt'];

    //check if no token 
    if (!jwtToken) {
        return res.status(401).json({ msg: 'No auth token provided' });
    }

    try {
        const decoded = jwt.verify(jwtToken, config.get('jwtSecret'));
        req.user = decoded.user;
        console.log("Decoded:" + decoded)
        if (!req.user.business) {
            return res.status(401).json({ "msg": "Subscription ended" })
        }
        next();
    } catch (error) {
        console.log("Error while authenticating:", error)
        res.status(401).json({ msg: 'Invalid JWT token' });
    }
};

module.exports = middleware;