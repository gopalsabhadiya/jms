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
                party = await ItemModel.findOneAndUpdate({ _id: req.body._id }, req.body);
                console.log(req.body);

                return res.json(req.body);
            }
            const item = new ItemModel(req.body);
            console.log("item:", item);
            item.user = req.user.id;
            item.save();
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
            let items = await ItemModel.find({ user: req.user.id });

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

            await UserModel.findOneAndRemove({ _id: req.params.party_id });


            return res.json({ msg: 'Party Deleted successfully' });

        } catch (error) {
            console.error(`Error while fetching Party: ${req.params.party_id}`);
            return res.status(500).send(error.message);
        }
    }
);

module.exports = router;