const validate = require('./validationFunctions');
const { ValidationDictionary } = require('./validationConfig')
const { validationResult, ValidationChain } = require('express-validator');

const validationMiddleware = async (request, response, next) => {
    const listToBeValidated = getValidationList(request);
    console.log('Validating request ', request.baseUrl, 'for ', listToBeValidated);

    await Promise.all(listToBeValidated.map(itemToBeValidated => validate[itemToBeValidated]()).map(validation => validation.run(request)));

    const error = validationResult(request);

    if (!error.isEmpty()) {
        console.log(error.errors.map(error => error.msg));
        return response.status(400).json({ 'msg': error.errors.map(error => error.msg)[0] });
    }

    next();
};

const getValidationList = (request) => {
    try {
        return ValidationDictionary[request.baseUrl][request.method];
    } catch (error) {
        console.log(error);
        return [];
    }
}

module.exports = validationMiddleware;