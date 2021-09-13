const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const ReceiptModel = require('../../model/paymentReceipt/ReceiptModel');
const mongoose = require('mongoose');
const PartyModel = require('../../model/party/PartyModel');

const searchReceipts = [
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
            'type': 1,
            'ammount': 1,
            'party': {
                'partyId': 1,
                'name': 1,
                'contactNo': 1,
                '_id': 1
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
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            if (req.body._id) {
                let receipt = req.body;
                delete receipt['date'];
                let party = receipt.party;
                receipt.party = receipt.party._id;
                receipt = await ReceiptModel.findOneAndUpdate({ _id: receipt._id }, receipt);
                receipt = receipt.toJSON();
                receipt.party = party;
                return res.json(receipt);
            }

            let receipt = new ReceiptModel(req.body);
            if (!receipt.party) {
                return res.status(400);
            }
            receipt.user = req.user.id;
            receipt.business = req.user.business;
            receipt.party = req.body.party;

            let party = await PartyModel.findById(receipt.party);
            party.balance = party.balance - receipt.ammount;
            await PartyModel.findOneAndUpdate({ _id: party._id }, party);
            receipt = await receipt.save();
            receipt = receipt.toJSON();
            receipt.party = party.toJSON();
            return res.json(receipt);


        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get(
    '/:receipt_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let receipt = await ReceiptModel.findById(req.params.receipt_id);

            if (receipt) {
                return res.status(200).json(item);
            }

            return res.status(404).json({ msg: 'Receipt not found' });

        } catch (error) {
            console.error(`Error while fetching Receipt`);
            return res.status(500).send(error.message);
        }
    }
);

router.delete(
    '/:receipt_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            await ReceiptModel.findOneAndRemove({ _id: req.params.receipt_id });

            return res.json({ msg: 'Receipt Deleted successfully' });

        } catch (error) {
            console.error(`Error while fetching Party: ${req.params.party_id}`);
            return res.status(500).send(error.message);
        }
    }
);

router.get('/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving new request search:", req.baseUrl);
        try {

            searchReceipts[0]['$match']['business'] = mongoose.Types.ObjectId(req.user.business);
            let receipts = await ReceiptModel.aggregate(searchReceipts);

            res.json(receipts);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;