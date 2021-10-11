const express = require('express');
const router = express.Router();
const OrderModel = require('../../model/order/OrderModel');
const mongoose = require('mongoose');
const ItemModel = require('../../model/item/ItemModel');
const validationMiddleware = require('../../middleware/validation/validate');
const ReceiptModel = require('../../model/receipt/ReceiptModel');



const item1 = {"stockPieces":1,"category":"Gold","type":"Ladies Ring","extras":[{"pieces":10,"type":"Diamond","rate":1,"labourCharge":10},{"pieces":0,"type":"Rhodium","rate":250,"labourCharge":0},{"pieces":0,"type":"Hall Mark","rate":250,"labourCharge":0}],"labour":{"value":12,"type":"Percentage"},"huid":"G6857H987R","grossWeight":10,"netWeight":10,"carat":22,"name":"Gold Ladies Ring","user":"611d5c1181eed425bcba9a3a","business":"613aee5346c199325cea723c","itemId":42,"__v":0}
const item2 = {"stockPieces":1,"category":"Gold","type":"Gents Ring","extras":[{"pieces":15,"type":"Diamond","rate":10,"labourCharge":15},{"pieces":0,"type":"Rhodium","rate":250,"labourCharge":0},{"pieces":0,"type":"Hall Mark","rate":250,"labourCharge":0}],"labour":{"value":10,"type":"Percentage"},"huid":"DFH65764SS","grossWeight":5,"netWeight":5,"carat":18,"name":"Gold Gents Ring","user":"611d5c1181eed425bcba9a3a","business":"613aee5346c199325cea723c","itemId":43,"__v":0}
const item3 = {"stockPieces":10,"category":"Silver","type":"Paayal","extras":[],"labour":{"value":10,"type":"Percentage"},"grossWeight":15,"netWeight":15,"name":"Silver Paayal","user":"611d5c1181eed425bcba9a3a","business":"613aee5346c199325cea723c","itemId":44,"__v":0}
/**
 *  @route     GET api/auth
 *  @desc      Generate auth token
 *  @access    Public
 */
router.delete(
    '/',
    validationMiddleware,
    async (req, res) => {
        console.log("Cleaning up request:", req.baseUrl)
        try {
            await OrderModel.deleteMany({ business: mongoose.Types.ObjectId('613aee5346c199325cea723c') });
            await ItemModel.deleteMany({ business: mongoose.Types.ObjectId('613aee5346c199325cea723c') });
            await ReceiptModel.deleteMany({ business: mongoose.Types.ObjectId('613aee5346c199325cea723c') });
            let item = new ItemModel(item1);
            await item.save();
            item = new ItemModel(item2);
            await item.save();
            item =  new ItemModel(item3);
            await item.save();
            return res.json({ msg: 'Cleaned up successfully' });
        } catch (error) {
            console.log('Error:', error);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
);

module.exports = router;