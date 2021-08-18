const express = require('express');
const router = express.Router();
const validate = require('../../middleware/validation/validate');
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../../middleware/auth');

const UserModel = require('../../model/user/UserModel');


/**
 *  @route     POST api/users
 *  @desc      Register User
 *  @access    Public
 */
router.post('/',
    validate(['userName', 'email', 'passwordWithLength']),
    async (req, res) => {
        console.log(req.body);
        try {


            let user = await UserModel.findOne({ email: req.body.email });

            if (user) {
                console.error(`User: ${user.email} already exists`);
                return res.status(400).json({ errors: [{ msg: 'User Already exists' }] });
            }

            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new UserModel(req.body);
            user.avatar = avatar;

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(req.body.password, salt);
            await user.save();

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
            )


        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get(
    '/',
    authMiddleware,
    async (req, res) => {

        try {
            console.log(req)
            let user = await User.findById(req.user.id).select('-password');

            if (user) {
                return res.status(200).json(user);
            }

            return res.status(404).json({ msg: 'User not found' });

        } catch (error) {
            console.error(`Error while fetching User: ${req.user.id}`);
            return res.status(500).send(error.message);
        }
    }
);

router.delete(
    '/:user_id',
    authMiddleware,
    async (req, res) => {

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