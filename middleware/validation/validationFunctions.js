const { check } = require('express-validator');

const validationFunctions = {
    email: () => check('email', 'Email is not valid').isEmail(),
    passwordWithLength: () => check('password', 'Password length must be minimum 6 characters').isLength({ min: 6 }),
    password: () => check('password', 'Please enter password').exists(),
    userName: () => check('name', 'Name is mandatory').not().isEmpty(),
}

module.exports = validationFunctions;