const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');
const OrderModel = require('../../model/order/OrderModel');
const mongoose = require('mongoose');
const { updateOrder } = require('../../util/ammountCalculator');
const moment = require('moment');
const { generateReceipt } = require('../../util/receiptGenerator');
const ReceiptModel = require('../../model/paymentReceipt/ReceiptModel');
const { ItemStatus } = require('../../util/enum');
const ItemModel = require('../../model/item/ItemModel');

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
            'business': '',
            invalidated: { $ne: true }
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
            updateOrder(req.body);
            let order = new OrderModel(req.body);

            order.partyPreBalance = party.balance.toFixed(2);
            order.party = party._id;
            order.partyPostBalance = (order.partyPreBalance - order.billOutstanding + (order.payment ? order.payment.ammount : 0)).toFixed(2);
            party.order.push(order._id);

            party.balance = (party.balance - order.billOutstanding + (order.payment ? order.payment.ammount : 0)).toFixed(2);

            order.user = req.user.id;
            order.business = req.user.business;

            if (
                order.payment
                && order.payment.ammount
                && order.payment.ammount !== 0
                && order.payment.type
            ) {
                let receipt = new ReceiptModel(generateReceipt(req.user, order, party));
                order.receipt = receipt._id;
                await receipt.save();
                order.receipt = receipt._id;
            }

            for (let item of order.items) {
                let stockItem = null;
                if (item.stockItemId) {
                    stockItem = await ItemModel.findById(item.stockItemId);
                    if (stockItem.stockPieces === 0) {
                        return res.status(304).json({});
                    }
                    stockItem.stockPieces > item.pieces
                        ? stockItem.stockPieces = stockItem.stockPieces - item.pieces
                        : stockItem.stockPieces = 0;
                }
                else {
                    stockItem = new ItemModel(item);
                    item.stockItemId = stockItem._id;
                }
                await ItemModel.findOneAndUpdate({ _id: stockItem._id }, stockItem, { upsert: true });
            }


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

        if (newOrder.payment) {
            let receipt = null;

            if (oldOrder.receipt) {
                receipt = await ReceiptModel.findById(oldOrder.receipt);
                receipt.ammount = newOrder.payment.ammount;
                receipt.type = newOrder.payment.type;
                receipt.checkNumber = newOrder.payment.checkNumber;
                receipt.bank = newOrder.payment.bank;
            }
            else {
                receipt = new ReceiptModel(newOrder.payment);
                receipt.business = req.user.business;
                receipt.user = req.user.id;
                receipt.party = oldOrder.party;
                receipt.order = oldOrder._id;
                newOrder.receipt = receipt._id
            }
            await ReceiptModel.findOneAndUpdate({ _id: receipt._id }, receipt, { upsert: true });

        }



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

            let order = await OrderModel.findById(req.params.order_id);
            order.invalidated = true;

            for (let [index, item] of order.items.entries()) {
                item = await ItemModel.findById(item.stockItemId);
                item.stockPieces = item.stockPieces + parseInt(order.items[index].pieces);
                await item.save();
            }

            let party = await PartyModel.findById(order.party);
            party.balance = party.balance + order.billOutstanding;
            if (order.receipt) {
                let receipt = await ReceiptModel.findById(order.receipt);
                receipt.invalidated = true;
                party.balance = party.balance + receipt.ammount -order.billOutstanding;
                receipt.save();
            }

            await order.save();
            await party.save();

            return res.json({ msg: 'Order Deleted successfully' });

        } catch (error) {
            console.error(`Error while fetching User: ${req.user.id}`);
            console.log(error)
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