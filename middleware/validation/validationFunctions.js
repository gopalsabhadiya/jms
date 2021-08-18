const { check } = require('express-validator');

const validationFunctions = {
    email: () => check('email', 'Email is not valid').isEmail(),
    passwordWithLength: () => check('password', 'Password length must be minimum 6 characters').isLength({ min:6 }),
    password: () => check('password', 'Please enter password').exists(),
    commentText: () => check('text', "Comment text is required").not().isEmpty(),
    school: () => check('school', 'School Mandatory').not().isEmpty(),
    degree: () => check('degree', 'Degree Mandatory').not().isEmpty(),
    fieldofstudy: () => check('fieldofstudy', 'Field of study Mandatory').not().isEmpty(),
    educationFrom: () => check('from', 'From Mandatory').not().isEmpty(),
    experienceTitle: () => check('title', 'Title Mandatory').not().isEmpty(),
    experienceCompany: () => check('company', 'Company Mandatory').not().isEmpty(),
    experienceFrom: () => check('from', 'From Mandatory').not().isEmpty(),
    postText: () => check('text', "Text is required").not().isEmpty(),
    profileStatus: () => check('status', 'Status is mandatory').not().isEmpty(),
    profileSkills: () => check('skills', 'Skills is mandatory').not().isEmpty(),
    userName: () => check('name', 'Name is mandatory').not().isEmpty(),
    email: () => check('email', 'Email is not valid').isEmail()
}

module.exports = validationFunctions;