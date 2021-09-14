const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const ItemModel = require('../../model/item/ItemModel');
const { ItemStatus } = require('../../util/enum');


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
                item = await ItemModel.findOneAndUpdate({ _id: item._id }, item, { new: true });
                console.log("Updated Item", item);
                return res.json(item);
            }

            req.body.extras = req.body.extras.filter(extra => extra.type);
            let item = new ItemModel(req.body);
            item.name = item.category + " " + item.type;
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
            let items = await ItemModel.find({ business: req.user.business, stockPieces: { $gt: 0 } });

            if (items) {
                return res.status(200).json(items);
            }

            return res.status(404).json({ msg: 'Parties not found' });

        } catch (error) {
            console.error(`Error while fetching Item`);
            return res.status(500).send(error.message);
        }
    }
);

router.get(
    '/:item_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let item = await ItemModel.findById(req.params.item_id).lean().exec();

            item.stockItemId = item._id;

            console.log("Serving item: ", item);

            if (item) {
                return res.status(200).json({ ...item, stockItemId: item._id });
            }

            return res.status(404).json({ msg: 'Item not found' });

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

router.post('/search',
    authMiddleware,
    async (req, res) => {
        console.log("Serving new request search:", req.baseUrl);
        try {

            let item = await ItemModel.search(req.body.term, req.user.business, (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    return data;
                }
            });

            if (!item) {
                console.error('No Items for User:');
                return res.status(400).json({ errors: [{ msg: 'Items not available' }] });
            }
            res.json(item);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;