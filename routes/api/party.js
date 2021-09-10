const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');
const mongoose = require('mongoose');


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

            if (req.body.gstin) {
                let party = await PartyModel.findOne({ email: req.body.gstin });

                if (party) {
                    return res.status(400).json({ errors: [{ msg: 'Party Already exists' }] });
                }

            }

            if (req.body._id) {
                party = await PartyModel.findOneAndUpdate({ _id: req.body._id }, req.body);
                console.log(req.body);

                return res.json(req.body);
            }

            party = new PartyModel(req.body);
            party.type = "Retail";

            party.user = req.user.id;
            party = await party.save();

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

router.get('/:party_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {


            let party = await PartyModel.findById({ _id: req.params.party_id });

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

router.post('/search',
    authMiddleware,
    async (req, res) => {
        console.log("Serving new request search:", req.baseUrl);
        try {
            console.log(req.body)

            let party = await PartyModel.search(req.body.term, req.user.business, (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    return data;
                }
            });

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

module.exports = router;