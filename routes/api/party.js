const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const { createParty, updateParty, getPartyByBusiness, searchParty, deleteParty, getPartyById } = require('../../service/party');


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

            let party = await createParty(req.user, req.body);
            return res.json(party);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.put('/',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            let party = await updateParty(req.body);
            return res.json(party);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            let party = await getPartyByBusiness(req.user.business);
            return res.json(party);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/:party_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            let party = await getPartyById(req.params.party_id);
            return res.json(party);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.delete('/:party_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            let party = await deleteParty(req.params.party_id);
            return res.json({ msg: "Deleted successfully" });

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.post('/search',
    authMiddleware,
    async (req, res) => {
        console.log("Serving new request search:", req.baseUrl);
        try {

            let party = await searchParty(req.user, req.body.term)
            return res.json(party);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;