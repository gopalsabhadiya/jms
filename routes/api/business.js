const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const BusinessModel = require('../../model/business/BusinessModel');


/**
 *  @route     POST api/business
 *  @desc      Register Business
 *  @access    Public
 */
router.post('/',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let business = await BusinessModel.findOne({ email: req.body.email });

            if (business) {
                console.error(`Business: ${business.email} already exists`);
                return res.status(400).json({ errors: [{ msg: 'Business Already exists' }] });
            }

            console.log(req.user);

            business = new BusinessModel(req.body);
            business.user = req.user.id;

            await business.save();

            return res.json({ "msg": "Businsess registered successfully" })


        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get(
    '/:business_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let business = await BusinessModel.findOne({ _id: req.params.business_id, user: req.user.id });

            if (business) {
                return res.status(200).json(business);
            }

            return res.status(404).json({ msg: 'Business not found' });

        } catch (error) {
            console.error(`Error while fetching Business: ${req.params.business_id}`);
            return res.status(500).send(error.message);
        }
    }
);

router.delete(
    '/:business_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            console.log(req.params.user_id)

            await BusinessModel.findOneAndRemove({ _id: req.params.business_id });


            return res.json({ msg: 'Business Deleted successfully' });

        } catch (error) {
            console.error(`Error while deleting Business: ${req.params.business_id}`);
            return res.status(500).send(error.message);
        }
    }
);

router.put(
    '/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            console.log(req.body.id)

            const business = await BusinessModel.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });


            return res.json(business);

        } catch (error) {
            console.error(`Error while deleting Business: ${req.params.business_id}`);
            return res.status(500).send(error.message);
        }
    }
);

module.exports = router;