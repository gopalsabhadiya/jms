const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');
const OrderModel = require('../../model/order/OrderModel');
const mongoose = require('mongoose');
const { updateOrder } = require('../../util/ammountCalculator');
const moment = require('moment');

const orderAggregate = [
    {
        '$match': {
            '_id': ''
        }
    }, {
        '$lookup': {
            'from': 'parties',
            'localField': 'party',
            'foreignField': '_id',
            'as': 'party'
        }
    }, {
        '$project': {
            'party': {
                'name': 1,
                'cointactNo': 1,
                'gstin': 1,
                'balance': 1,
                'address': 1,
                'type': 1,
            },
            'items': 1,
            'gst': 1,
            'scrap': 1,
            'payment': 1,
            'date': 1,
            'netAmmount': 1,
            'totalAmmount': 1,
            'partyPreBalance': 1,
            'partyPostBalance': 1,
            'finalAmmount': 1,
            'billOutstanding': 1,
            'kasar': 1,
            'orderId': 1,
            'date': {
                '$dateToString': {
                    'format': '%d-%m-%Y',
                    'date': '$date'
                }
            },
        }
    }, {
        '$unwind': {
            'path': '$party'
        }
    }
];

const orderDetailsAggregate = [
    {
        '$match': {
            'business': ''
        }
    }, {
        '$lookup': {
            'from': 'parties',
            'localField': 'party',
            'foreignField': '_id',
            'as': 'party'
        }
    }, {
        '$project': {
            'billOutstanding': 1,
            'orderId': 1,
            'party': {
                'name': 1,
                'contactNo': 1
            },
            'date': {
                '$dateToString': {
                    'format': '%d-%m-%Y',
                    'date': '$date'
                }
            }
        }
    }, {
        '$unwind': {
            'path': '$party'
        }
    }
];
/**
 *  @route     POST api/users
 *  @desc      Register User
 *  @access    Public
 */
router.post('/',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        console.log("Serving post request:", req.baseUrl);
        try {

            let party = await PartyModel.findById({ _id: req.body.party });
            let order = new OrderModel(req.body);

            updateOrder(order);

            order.partyPreBalance = party.balance.toFixed(2);
            order.party = party._id;
            order.partyPostBalance = (order.partyPreBalance - order.billOutstanding + (order.payment ? order.payment.ammount : 0)).toFixed(2);
            party.order.push(order._id);

            party.balance = (party.balance - order.billOutstanding + (order.payment ? order.payment.ammount : 0)).toFixed(2);

            order.user = req.user.id;
            order.business = req.user.business;
            await order.save();
            await party.save();

            res.json({ orderId: order._id });

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.put('/',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        let newOrder = req.body;
        let oldOrder = await OrderModel.findById({ _id: newOrder._id });
        let party = await PartyModel.findById({ _id: oldOrder.party });
        updateOrder(newOrder);

        newOrder.partyPreBalance = (oldOrder.partyPreBalance).toFixed(2);
        newOrder.partyPostBalance = (newOrder.partyPreBalance - newOrder.billOutstanding + (newOrder.payment ? parseFloat(newOrder.payment.ammount) : 0)).toFixed(2);
        party.balance = (newOrder.partyPostBalance - oldOrder.partyPostBalance + party.balance).toFixed(2);
        newOrder.party = party._id;

        newOrder.date = moment(newOrder.date, 'DD-MM-YYYY').format('YYYY-MM-DD[T00:00:00.000Z]');

        await OrderModel.findOneAndUpdate({ _id: oldOrder._id }, newOrder);
        await PartyModel.findOneAndUpdate({ _id: party._id }, party);

        return res.json(newOrder);


    }
)

router.delete(
    '/:order_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving delete request:", req.baseUrl);
        try {
            console.log(req.params.user_id)

            await OrderModel.findOneAndRemove({ _id: req.params.order_id });


            return res.json({ msg: 'User Deleted successfully' });

        } catch (error) {
            console.error(`Error while fetching User: ${req.user.id}`);
            return res.status(500).send(error.message);
        }
    }
);

router.get(
    '/:order_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving get request:", req.baseUrl);
        try {
            console.log(req.params.order_id)
            if (mongoose.Types.ObjectId.isValid(req.params.order_id)) {
                orderAggregate[0]['$match']['_id'] = mongoose.Types.ObjectId(req.params.order_id);
                console.log(orderAggregate)
                const order = await OrderModel.aggregate(orderAggregate);
                console.log(order)
                return res.json(order[0]);
            }

            orderDetailsAggregate[0]['$match']['business'] = mongoose.Types.ObjectId(req.user.business);

            const orderDetails = await OrderModel.aggregate(orderDetailsAggregate);

            return res.json(orderDetails);


        } catch (error) {
            console.error(`Error while fetching order: ${req.user.order_id}`);
            console.log(error)
            return res.status(500).send(error.message);
        }
    }
);

module.exports = router;