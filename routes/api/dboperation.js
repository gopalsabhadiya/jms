const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const mongoose = require('mongoose');
const PartyModel = require("../../model/party/PartyModel");
const OrderModel = require("../../model/order/OrderModel");

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

            let orders = await OrderModel.find({"business": req.user.business});
            for(let i in orders) {
                let order = orders[i];

                console.log("Gold rate: " + order.items[0].rate);
                order.goldRate = order.items[0].rate;
                for (let j in order.items) {
                    let item = order.items[j];
                    item.type = item.name.split(" ")[0];
                    item.category = item.name.split(" ")[1];
                    let labour = item.labour;
                    if(labour.type == "Percentage") {
                        labour.type = "PERCENTAGE";
                    }
                    if(labour.type == "Per Gram") {
                        labour.type = "PER_GRAM";
                    }
                    if(labour.type == "Total") {
                        labour.type = "TOTAL";
                    }
                    console.log(labour);
                    item.rate = undefined;
                    // console.log(item);
                }
                // console.log(order);
                await order.save();
                // order.goldRate = order.items[0].rate;
            }
            return res;

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);
module.exports = router;