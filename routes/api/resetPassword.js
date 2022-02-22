const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('config');
const UserModel = require('../../model/user/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 *  @route     GET api/auth
 *  @desc      Generate auth token
 *  @access    Public
 */
router.post(
    '/',
    async (req, res) => {
        console.log("Email request:", req.baseUrl)
        try {
            let resetPasswordPayload = req.body;
            const decoded = jwt.verify(req.cookies['jwt'], config.get('jwtSecret'));
            if (decoded.otp.toString() === resetPasswordPayload.otp) {
                let user = await UserModel.findOne({ email: decoded.email });
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
                await user.save();
                return res.json({ "msg": "Password changed successfully" });
            }
            return res.status(400).json({ 'msg': "Invalid otp" });
        } catch (error) {
            console.log('Error:', error);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
);

router.post(
    '/varifyotp',
    async (req, res) => {
        console.log("Verify OTP request:", req.baseUrl)
        try {
            let otp = req.body.otp;
            const decoded = jwt.verify(req.cookies['jwt'], config.get('jwtSecret'));
            if(decoded.otp == otp) {
                return res.status(200).json({});
            }
            console.log(decoded);
            console.log(decoded.otp == otp);
            return res.status(400).json({ 'msg': "Invalid otp" });
        } catch (error) {
            console.log('Error:', error);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
);

router.post(
    '/mail',
    async (req, res) => {
        console.log("Email request:", req.baseUrl)
        try {
            let email = req.body.email;
            let user = await UserModel.find({ email });
            if (!user || user.length === 0) {
                return res.status(404).json({ 'msg': 'No user with this email id' });
            }

            let otp = Math.floor(100000 + Math.random() * 900000);
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.get('nodemailer.email'),
                    pass: config.get('nodemailer.password')
                }
            });

            let mailOptions = {
                from: config.get('nodemailer.email'),
                to: email,
                subject: 'Zaveribook: OTP for password reset',
                text: "OTP: " + otp
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("mail sent", info.response)
                }
            });

            const payload = {
                otp,
                email
            };

            console.log("Payload:", payload);
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 600 },
                (error, token) => {
                    if (error) throw error;
                    res.cookie('jwt', token, {maxAge: 864000000, httpOnly: true});
                    res.json({ });
                }
            );

            return res;
        } catch (error) {
            console.log('Error:', error);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
);

module.exports = router;