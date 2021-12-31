const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const ItemModel = require('../../model/item/ItemModel');
const { getNextItemCount } = require('../../service/counter');
const { createItem, updateItem, getItemById, getItemByBusiness, deleteItem, searchItem } = require('../../service/item');

/**
 *  @route     POST api/users
 *  @desc      Register User
 *  @access    Public
 */
router.post(
    '/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            item = await createItem(req.user, req.body);
            return res.json(item);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.put(
    '/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            let item = await updateItem(req.body);
            return res.json(item);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
)

router.get(
    '/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            console.log("Page:" + req.query.page);

            let items = await getItemByBusiness(req.user.business, parseInt(req.query.skip), req.query.searchTerm);
            return res.json(items);

        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.get(
    '/:item_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            let item = await getItemById(req.params.item_id);
            return res.json(item);

        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.delete(
    '/:item_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            await deleteItem(req.params.item_id);


            return res.json({ msg: 'Party Deleted successfully' });

        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.post('/search',
    authMiddleware,
    async (req, res) => {
        console.log("Serving new request search:", req.baseUrl);
        try {

            let item = await searchItem(req.user, req.body.term);

            return res.json(item);

        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;