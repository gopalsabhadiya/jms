const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');
const OrderModel = require('../../model/order/OrderModel');
const { LabourTypeEnum, ExtraChargablesTypeEnum } = require('../../util/enum');


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


            let party = await PartyModel.findById({ _id: req.body.party });
            let order = new OrderModel(req.body);
            let taxAmmount = 0;
            let netAmmount = 0;
            let scrapAmmount = 0;

            for (let i = 0; i < order.items.length; i++) {
                let item = order.items[i];

                let labourCharges = 0;
                let extraCharges = 0;
                let itemAmmount = item.netWeight * item.rate;

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

            console.log('net ammount:', order.netAmmount);


            if (order.gst) {
                console.log("into GST")
                for (let gst of order.gst) {
                    taxAmmount += gst.value * order.netAmmount * 0.01;
                }
            }

            console.log('tax Ammount:', taxAmmount);

            order.totalAmmount = order.netAmmount + taxAmmount;

            if (order.scrap) {
                scrapAmmount = order.scrap.netWeight * order.scrap.rate;
            }

            order.scrap.netAmmount = scrapAmmount;
            order.scrapAmmount = scrapAmmount;
            order.finalAmmount = order.totalAmmount - order.scrapAmmount;
            order.billOutstanding = order.totalAmmount - order.scrapAmmount - order.kasar;
            order.partyPreBalance = party.balance;
            order.party = party._id;
            order.partyPostBalance = order.partyPreBalance - order.billOutstanding;

            if (order.kasar) {
                order.billOutstanding -= order.kasar;
            }

            party.order.push(order._id);

            party.balance = party.balance - order.billOutstanding;

            await order.save();
            await party.save();

            res.json({ msg: "Order placed successfully" });

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;