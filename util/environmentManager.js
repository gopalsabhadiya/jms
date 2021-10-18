const config = require('config');
require('dotenv').config();

const isProduction = () => {
    return process.env.NODE_ENV === "production";
};

const getActivationLink = () => {
    console.log("Environment:", process.env.NODE_ENV);
    return isProduction() ? config.get('accountVerification.productionLink') : config.get('accountVerification.developmentLink');
};

module.exports = {
    getActivationLink
}

