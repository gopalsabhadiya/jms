const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');
const OrderModel = require('../../model/order/OrderModel');
const { LabourTypeEnum, ExtraChargablesTypeEnum } = require('../../util/enum');
const mongoose = require('mongoose');

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
            let taxAmmount = 0;
            let netAmmount = 0;
            let scrapAmmount = 0;

            for (let i = 0; i < order.items.length; i++) {
                let item = order.items[i];

                let labourCharges = 0;
                let extraCharges = 0;
                let itemAmmount = item.netWeight * item.rate / 10;

                console.log('item ammount:', itemAmmount);


                if (item.labour) {
                    switch (item.labour.type) {
                        case LabourTypeEnum.PERCENTAGE:
                            labourCharges = netAmmount * item.labour.value * 0.01;
                            break;
                        case LabourTypeEnum.PER_GRAM:
                            labourCharges = item.netWeight * item.labour.value;
                            break;
                        case LabourTypeEnum.TOTAL:
                            labourCharges = item.labour.value;
                            break;
                        default:
                            break;
                    }
                }

                console.log('labour charges:', labourCharges);
                if (item.extras) {
                    for (let extra of item.extras) {
                        switch (extra.type) {
                            case ExtraChargablesTypeEnum.DAIMOND:
                                console.log('Diamond Charge: ', extra.rate * extra.pieces + extra.labourCharge * extra.pieces);
                                extraCharges += extra.rate * extra.pieces + extra.labourCharge * extra.pieces;
                                break;
                            case ExtraChargablesTypeEnum.HALL_MARK:
                                extraCharges += extra.rate;
                                break;
                            case ExtraChargablesTypeEnum.RHODIUM:
                                extraCharges += extra.rate;
                                break;
                            default:
                                break;
                        }
                    }
                }
                console.log('extra charges:', extraCharges);

                order.items[i].itemAmmount = itemAmmount;
                order.items[i].netAmmount = itemAmmount + labourCharges + extraCharges;
                netAmmount += order.items[i].netAmmount;
            }

            order.netAmmount = netAmmount;

            if (order.gst) {
                console.log("into GST")
                for (let gst of order.gst) {
                    taxAmmount += gst.value * order.netAmmount * 0.01;
                }
            }

            console.log('tax Ammount:', taxAmmount);

            order.totalAmmount = order.netAmmount + taxAmmount;

            if (order.scrap) {
                scrapAmmount = order.scrap.netWeight * order.scrap.rate / 10;
            }

            order.scrap.netAmmount = scrapAmmount;
            order.scrapAmmount = scrapAmmount;
            order.finalAmmount = order.totalAmmount - order.scrapAmmount;
            order.billOutstanding = order.totalAmmount - order.scrapAmmount - order.kasar;
            order.partyPreBalance = party.balance;
            order.party = party._id;
            order.partyPostBalance = order.partyPreBalance - order.billOutstanding + order.payment.ammount;

            if (order.kasar) {
                order.billOutstanding -= order.kasar;
            }

            party.order.push(order._id);

            party.balance = party.balance - order.billOutstanding + order.payment.ammount;

            await order.save();
            await party.save();

            res.json({ msg: "Order placed successfully" });

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

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