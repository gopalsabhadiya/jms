const jwt = require('jsonwebtoken');
const config = require('config');

const middleware = (req, res, next) => {
    console.log("AuthMiddleware:"+req.baseUrl);
    //get token from header
    const token = req.header('x-auth-token');
    var jwtToken = req.cookies['jwt'];
    console.log("JWTTOKEN:"+jwtToken);
    console.log("TOKEN:"+token);

    //check if no token 
    if (!jwtToken) {
        console.log("No Token" + token);
        return res.status(401).json({ msg: 'No auth token provided' });
    }

    try {
        const decoded = jwt.verify(jwtToken, config.get('jwtSecret'));
        req.user = decoded.user;
        let currentDate = new Date();
        let subscriptionDate = new Date(req.user.subscriptionEnd);
        if (!config.get('skipUriForSubscription').includes(req.baseUrl) && (!req.user.business || subscriptionDate <= currentDate)) {
            console.log("Into 401 unauthorised");
            return res.status(401).json({ "msg": "Subscription ended" })
        }
        next();
    } catch (error) {
        console.log("Error while authenticating:", error)
        res.status(401).json({ msg: 'Invalid JWT token' });
    }
};

module.exports = middleware;