const validate = require('./validationFunctions');
const { validationResult, ValidationChain } = require('express-validator');

const validationMiddleware = (listToBeValidated) => {
    return async (request, response, next) => {
        console.log(listToBeValidated);
        await Promise.all(listToBeValidated.map(itemToBeValidated => validate[itemToBeValidated]()).map(validation => validation.run(request)));

        const error = validationResult(request);

        if (!error.isEmpty()) {
            console.log(error);
            return response.status(400).json(error.array());
        }

        next();
    }
};

module.exports = validationMiddleware;