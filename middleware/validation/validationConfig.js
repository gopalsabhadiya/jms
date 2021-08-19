const ValidationDictionary = {
    "/api/user": {
        "POST": ['userName', 'email', 'passwordWithLength']
    },
    "/api/auth": {
        "POST": ['email', 'password']
    },
    "/api/business": {
        "POST": ['businessName', 'businessAddress', 'businessGstin', 'businessEmail', 'businessContactNo', 'businessBankName', 'businessBankAccountNo', 'businessBankIfsc', 'businessBankBranch']
    }
};

module.exports = {
    ValidationDictionary
}