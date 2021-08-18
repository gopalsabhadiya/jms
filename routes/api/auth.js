const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../../model/user/UserModel');
const config = require('config');
const validate = require('../../middleware/validation/validate');
const bcrypt = require('bcryptjs');


/**
 *  @route     GET api/auth
 *  @desc      Generate auth token
 *  @access    Public
 */
router.post(
    '/',
    validate(['email', 'password']),
    async (req, res) => {

        const { email, password } = req.body;

        console.log('hello');
        try {
            let user = await userModel.findOne({email});

            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    const payload = {
                        user: {
                            id: user.id
                        }
                    };
        
                    jwt.sign(
                        payload,
                        config.get('jwtSecret'),
                        { expiresIn: 36000 },
                        (error, token) => {
                            if (error) throw error;
                            res.json({ token });
                        }
                    );
                    return res;
                }
            }

            return res.status(400).json({ msg: 'Invalid Credentials'});

        } catch (error) {
            console.log(`Error while authenticating User: ${email} \n ${error}`);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
);

module.exports = router;