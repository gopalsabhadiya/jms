const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const BusinessModel = require('../../model/business/BusinessModel');
const ItemModel = require('../../model/item/ItemModel');
const OrderModel = require('../../model/order/OrderModel');
const ReceiptModel = require('../../model/receipt/ReceiptModel');
const { calculateBusinessState } = require('../../service/stats');
/**
 *  @route     POST api/users
 *  @desc      Register User
 *  @access    Public
 */
router.get('/business',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let business = await BusinessModel.findById(req.user.business).select({ itemCollection: 1, _id: 0});
            let response = calculateBusinessState(business);
            return res.json(response);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/item',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let response = {};
            let items = await ItemModel.find({business: req.user.business, stockPieces: {$gt: 0}}).select({stockPieces: 1, category:1, netWeight:1, type:1, date:1, _id:0});
            // response.businessStats = calculateBusinessState(business);
            return res.json(items);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/order',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let response = {};
            let orders = await OrderModel.find({business: req.user.business, invalidated: false}).select({finalAmmount: 1, billOutstanding:1, items: {type: 1, category: 1, netWeight:1}, date: 1, _id: 0});
            // response.businessStats = calculateBusinessState(business);
            return res.json(orders);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/payment',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let response = {};
            let payments = await ReceiptModel.find({business: req.user.business, invalidated: false}).select({activeAmmount: 1, date: 1, _id:0});
            return res.json(payments);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;