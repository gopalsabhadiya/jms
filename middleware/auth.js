const jwt = require('jsonwebtoken');
const config = require('config');

const middleware = (req, res, next) => {
    //get token from header
    const token = req.header('x-auth-token');

    console.log(token);

    //check if no token 
    if (!token) {
        return res.status(401).json({ msg: 'No auth token provided'});
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        console.log(decoded);
        req.user = decoded.user;
        console.log(req.user);
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Invalid JWT token'});
    }
};

module.exports = middleware;