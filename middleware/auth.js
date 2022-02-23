const jwt = require('jsonwebtoken');
const config = require('config');

const middleware = (req, res, next) => {
    console.log("Authenticating");
    //get token from header
    const token = req.header('x-auth-token');
    var jwtToken = req.cookies['jwt'];

    //check if no token 
    if (!jwtToken) {
        console.log("No Token" + token);
        return res.status(401).json({ msg: 'No auth token provided' });
    }

    try {
        const decoded = jwt.verify(jwtToken, config.get('jwtSecret'));
        req.user = decoded.user;
        let currentDate = new Date(2022, 10, 20);
        let subscriptionDate = new Date(req.user.subscriptionEnd);
        if (!req.user.business || subscriptionDate <= currentDate) {
            return res.status(401).json({ "msg": "Subscription ended" })
        }
        next();
    } catch (error) {
        console.log("Error while authenticating:", error)
        res.status(401).json({ msg: 'Invalid JWT token' });
    }
};

module.exports = middleware;