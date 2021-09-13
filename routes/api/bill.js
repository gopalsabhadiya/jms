const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');
const OrderModel = require('../../model/order/OrderModel');
const BusinessModel = require('../../model/business/BusinessModel');
const mongoose = require('mongoose');
const { BILLHTML } = require('../../util/staticdata');
const { ExtraChargablesTypeEnum, LabourTypeEnum } = require('../../util/enum');



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
            let business = await BusinessModel.findOne({ _id: req.user.business });
            let itemDetailsRows = generateItemDetailsRows(order.items);

            if (!order) {
                console.error(`Order: ${req.body.orderId} doesn't exists`);
                return res.status(400).json({ errors: [{ msg: 'Order doesn\'t exists' }] });
            }

            console.log(`${order.netAmmount * order.gst.find((gst) => gst.type === "CGST").value * 0.01}`);


            return res.json(eval("`" + BILLHTML + "`"));



        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

const generateItemDetailsRows = (items) => {
    let tableData = "";
    for (let i = 0; i < items.length; i++) {
        let extraDetails = prepareExtraDetails(items[i]);
        console.log('extra details: ', extraDetails);
        tableData += `<tr><td class="font13">${i + 1}</td><td class="font13">${extraDetails.name}</td><td class="font13">${extraDetails.pieces}<td class="font13">${items[i].grossWeight}</td></td><td class="font13">${items[i].netWeight}</td><td class="font13">${items[i].carat}</td><td class="font13">${extraDetails.rate}</td><td class="font13" colspan="2">${extraDetails.itemAmmount}</td><td class="font13">${extraDetails.labour}</td><td class="font13">${items[i].netAmmount}</td></tr>`;
    }
    console.log(tableData);
    return tableData;
}

const prepareExtraDetails = (item) => {
    let labour = '';
    switch (item.labour.type) {
        case LabourTypeEnum.PERCENTAGE:
            labour = `${item.labour.value} %`
            break;
        case LabourTypeEnum.PER_GRAM:
            labour = `${item.labour.value} (Per Gram)`
            break;
        case LabourTypeEnum.TOTAL:
            labour = `${item.labour.value}`
            break;
        default:
            break;
    }
    let extraDetails = {
        name: `${item.name} - ${item.huid}`,
        pieces: `${item.pieces}`,
        rate: `${item.rate}`,
        labour: `${labour}`,
        itemAmmount: `${item.itemAmmount}`
    };


    for (let extra of item.extras) {
        switch (extra.type) {
            case ExtraChargablesTypeEnum.DAIMOND:
                extraDetails.name = extraDetails.name + `<br>${extra.type}`;
                extraDetails.pieces = extraDetails.pieces + `<br>${extra.pieces}`;
                extraDetails.rate = extraDetails.rate + `<br>${extra.rate}`;
                extraDetails.labour = extraDetails.labour + `<br>${extra.labourCharge}`;
                if (extra.rate > 0) {
                    extraDetails.itemAmmount = extraDetails.itemAmmount + `<br>${extra.rate * extra.pieces}`;
                }
                break;
            case ExtraChargablesTypeEnum.HALL_MARK:
                extraDetails.name = extraDetails.name + `<br>${extra.type}`;
                extraDetails.rate = extraDetails.rate + `<br>${extra.rate}`;
                break;
            case ExtraChargablesTypeEnum.RHODIUM:
                extraDetails.name = extraDetails.name + `<br>${extra.type}`;
                extraDetails.rate = extraDetails.rate + `<br>${extra.rate}`;
                break;
            default:
                break;
        }
    }

    console.log(extraDetails)


    return extraDetails;
}

module.exports = router;