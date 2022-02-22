const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../../middleware/auth');
const nodemailer = require('nodemailer');

const UserModel = require('../../model/user/UserModel');
const { getActivationLink } = require('../../util/environmentManager');


/**
 *  @route     POST api/users
 *  @desc      Register User
 *  @access    Public
 */
router.post('/',
    validationMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            let user = await UserModel.findOne({ email: req.body.email });

            if (user) {
                console.error(`User: ${user.email} already exists`);
                return res.status(400).json({ msg: 'User Already exists' });
            }

            user = new UserModel(req.body);

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(req.body.password, salt);

            const payload = {
                email: user.email
            }

            try {

                let token = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 86400 })
                let activationLink = getActivationLink();
                console.log(activationLink, token)

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: config.get('nodemailer.email'),
                        pass: config.get('nodemailer.password')
                    }
                });

                let mailOptions = {
                    from: config.get('nodemailer.email'),
                    to: user.email,
                    subject: 'Zaveribook: Account verification',
                    text: "Verification link: " + activationLink + token
                }

                transporter.sendMail(mailOptions);

                await user.save();

            } catch (error) {
                console.log(error);
                return res.status(500).send('Internal Server Error');
            }

            return res.json({ 'msg': "User registered successfulyy" })

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.post(
    '/verify',
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let token = req.body.token;
            const decoded = jwt.verify(token, config.get('jwtSecret'));
            console.log(token, decoded)

            if (decoded.email) {
                let user = await UserModel.findOne({ email: decoded.email });
                user.verified = true;
                await user.save();
                return res.json({ "msg": "User verified successfully" });
            }
            return res.status(400).json({ 'msg': "Invalid otp" });
        } catch (error) {
            console.log('Error:', error);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
)

router.get(
    '/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            console.log(req.user)
            let user = await UserModel.findById(req.user.id).select('-password');

            if (user) {
                return res.status(200).json(user);
            }

            return res.status(404).json({ msg: 'User not found' });

        } catch (error) {
            console.error(`Error while fetching User: ${error} ${req.user.id}`);
            return res.status(500).send(error.message);
        }
    }
);

router.delete(
    '/:user_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            console.log(req.params.user_id)

            await UserModel.findOneAndRemove({ _id: req.params.user_id });


            return res.json({ msg: 'User Deleted successfully' });

        } catch (error) {
            console.error(`Error while fetching User: ${req.user.id}`);
            return res.status(500).send(error.message);
        }
    }
);

module.exports = router;