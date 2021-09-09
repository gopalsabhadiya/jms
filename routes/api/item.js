const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const UserModel = require('../../model/user/UserModel');
const ItemModel = require('../../model/item/ItemModel');


/**
 *  @route     POST api/users
 *  @desc      Register User
 *  @access    Public
 */
router.post('/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            if (req.body._id) {
                let item = req.body;
                item = await ItemModel.findOneAndUpdate({ _id: item._id }, item);
                console.log(item);

                return res.json(item);
            }

            req.body.extras = req.body.extras.filter(extra => extra.type);
            let item = new ItemModel(req.body);
            item.user = req.user.id;
            item.business = req.user.business;
            item = await item.save();
            return res.json(item);


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
        console.log("Serving request:", req.baseUrl);
        try {
            let items = await ItemModel.find({ business: req.user.business });

            if (items) {
                return res.status(200).json(items);
            }

            return res.status(404).json({ msg: 'Parties not found' });

        } catch (error) {
            console.error(`Error while fetching Party`);
            return res.status(500).send(error.message);
        }
    }
);

router.delete(
    '/:item_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            console.log(req.params.user_id)

            await ItemModel.findOneAndRemove({ _id: req.params.item_id });


            return res.json({ msg: 'Party Deleted successfully' });

        } catch (error) {
            console.error(`Error while fetching Party: ${req.params.party_id}`);
            return res.status(500).send(error.message);
        }
    }
);

module.exports = router;