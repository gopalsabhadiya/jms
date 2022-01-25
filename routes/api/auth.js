const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../../model/user/UserModel');
const config = require('config');
const validationMiddleware = require('../../middleware/validation/validate');
const bcrypt = require('bcryptjs');
const BusinessModel = require('../../model/business/BusinessModel');
const CounterModel = require('../../model/counter/CounterModel');


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

        const {email, password} = req.body;

        try {
            let user = await UserModel.findOne({email});
            let business = await BusinessModel.findById(user.business);

            console.log(business)

            if (business) {
                let counter = await CounterModel.findOne({business: business._id});
                let currentDate = new Date();

                if (user) {
                    if (await bcrypt.compare(password, user.password)) {
                        let payload = {};
                        let csrfPayload = {
                            user: {
                                id: user.id,
                            }
                        };

                        if (currentDate <= business.subscriptionEnd) {
                            payload = {
                                user: {
                                    id: user.id,
                                    business: user.business,
                                    counter: counter._id
                                }
                            };
                        } else {
                            payload = {
                                user: {
                                    id: user.id
                                }
                            };
                        }
                        let token = jwt.sign(
                            payload,
                            config.get('jwtSecret'),
                            {expiresIn: 864000}
                        );
                        let csrfToken = jwt.sign(csrfPayload, config.get('jwtSecret'), {expiresIn: 864000});
                        console.log("Returning response with cookie");
                        res.cookie('jwt', token, {maxAge: 864000000, httpOnly: true});
                        return res.send({
                            token: csrfToken,
                            subscriptionExpired: currentDate > business.subscriptionEnd
                        });
                    }
                }

                return res.status(400).json({msg: 'Invalid Credentials'});
            } else {
                if (user) {
                    if (await bcrypt.compare(password, user.password)) {
                        const payload = {
                            user: {
                                id: user.id,
                            }
                        };

                        let token = jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 36000});
                        return res.json({token, businessRegistered: false});
                    }
                }

                return res.status(400).json({msg: 'Invalid Credentials'});
            }


        } catch (error) {
            console.log(`Error while authenticating User: ${email} \n ${error}`);
            res.status(500).json({msg: 'Internal Server Error'});
        }
    }
);

router.post(
    '/validate',
    async (req, res) => {
        console.log("Validating authentication");

        var csrfToken = req.body;
        var jwtToken = req.cookies['jwt'];

        console.log('Csrf:' + csrfToken + " JWT:"+jwtToken);

        if (!jwtToken) {
            const decodedCsrf = jwt.verify(csrfToken.token, config.get('jwtSecret'));
            let user = await UserModel.findById(decodedCsrf.user.id);
            let counter = await CounterModel.findOne({business: user.business});
            console.log(user, counter);

            payload = {
                user: {
                    id: user.id,
                    business: user.business,
                    counter: counter._id
                }
            };

            let token = jwt.sign(
                payload,
                config.get('jwtSecret'),
                {expiresIn: 864000}
            );
            res.cookie('jwt', token, {maxAge: 864000000, httpOnly: true});
        }


        return res.status(200).json({"msg": "validated"});
    }
)

module.exports = router;