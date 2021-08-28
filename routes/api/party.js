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

            console.log("Party Input", req.body);
            party = new PartyModel(req.body);
            console.log("Party Modal", party);

            party.user = req.user.id;
            await PartyModel.findOneAndUpdate({ _id: party._id }, party, { upsert: true });

            res.json(party);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {


            let party = await PartyModel.find({ user: req.user.id });

            if (!party) {
                console.error(`No Parties for User: ${user.email}`);
                return res.status(400).json({ errors: [{ msg: 'Party not available' }] });
            }
            res.json(party);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.delete('/:party_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {


            let party = await PartyModel.findOneAndRemove({ _id: req.params.party_id });

            if (!party) {
                console.error(`No Parties for User: ${user.email}`);
                return res.status(400).json({ errors: [{ msg: 'Party not available' }] });
            }
            res.json({ msg: "Deleted successfully" });

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;