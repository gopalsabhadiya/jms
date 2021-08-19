const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');
const OrderModel = require('../../model/order/OrderModel');
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

            let order = await OrderModel.findById(req.body.orderId);
            let party = await PartyModel.findById(order.party);

            if (!order) {
                console.error(`Order: ${req.body.orderId} doesn't exists`);
                return res.status(400).json({ errors: [{ msg: 'Order doesn\'t exists' }] });
            }

            console.log(JSON.stringify(order));

            res.json({ msg: "Party registered successfully" });

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;