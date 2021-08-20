const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');


/**
 *  @route     POST api/users
 *  @desc      Register User
 *  @access    Public
 */
router.post('/',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {


            let party = await PartyModel.findOne({ email: req.body.gstin });

            if (party) {
                console.error(`User: ${user.email} already exists`);
                return res.status(400).json({ errors: [{ msg: 'Party Already exists' }] });
            }

            party = new PartyModel(req.body);
            party.user = req.user.id;
            await party.save();

            res.json({ msg: "Party registered successfully" });

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;