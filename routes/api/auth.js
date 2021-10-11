const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../../model/user/UserModel');
const config = require('config');
const validationMiddleware = require('../../middleware/validation/validate');
const bcrypt = require('bcryptjs');
const BusinessModel = require('../../model/business/BusinessModel');


/**
 *  @route     GET api/auth
 *  @desc      Generate auth token
 *  @access    Public
 */
router.post(
    '/',
    validationMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl)

        const { email, password } = req.body;

        try {
            let user = await UserModel.findOne({ email });
            let business = await BusinessModel.findById(user.business)

            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    const payload = {
                        user: {
                            id: user.id,
                            business: user.business,
                            counters: business.counters
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

            return res.status(400).json({ msg: 'Invalid Credentials' });

        } catch (error) {
            console.log(`Error while authenticating User: ${email} \n ${error}`);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
);

module.exports = router;