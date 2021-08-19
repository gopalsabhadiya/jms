const { check } = require('express-validator');

const validationFunctions = {
    email: () => check('email', 'Email is not valid').isEmail(),
    passwordWithLength: () => check('password', 'Password length must be minimum 6 characters').isLength({ min: 6 }),
    password: () => check('password', 'Please enter password').exists(),
    userName: () => check('name', 'Name is mandatory').not().isEmpty(),
    businessName: () => check('name', 'Business name is invalid').not().isEmpty(),
    businessAddress: () => check('address', 'Business address is invalid').not().isEmpty(),
    businessGstin: () => check('gstin', 'Business GSTIN is invalid').not().isEmpty(),
    businessEmail: () => check('email', 'Business email is invalid').not().isEmpty().isEmail(),
    businessContactNo: () => check('contact.*', 'Business Contact is invalid').isNumeric().isLength({ min: 10, max: 10 }),
    businessBankName: () => check('bank.name', 'Business bank name is invalid').not().isEmpty(),
    businessBankAccountNo: () => check('bank.accountNo', 'Business bank account number is invalid').not().isEmpty(),
    businessBankIfsc: () => check('bank.ifsc', 'Business bank IFSC Code is invalid').not().isEmpty(),
    businessBankBranch: () => check('bank.branch', 'Business bank branch is invalid').not().isEmpty(),
}

module.exports = validationFunctions;