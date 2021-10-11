const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');
const { RECEIPT_HTML } = require('../../util/staticdata');
const ReceiptModel = require('../../model/receipt/ReceiptModel');
const { getReceiptDetails, createNewReceipt, getReceiptWithParty } = require('../../service/receipt');
const { prepareOrderDetailsForReceipt } = require('../../util/receipt');

/**
 *  @route     POST api/users
 *  @desc      Register User
 *  @access    Public
 */

router.post(
    '/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            let receipt = await createNewReceipt(req.user, req.body);
            console.log("returning response", receipt);
            return res.json(receipt);
        } catch (error) {
            console.log("error:", error)
        }
    }
)

router.post(
    '/view',
    authMiddleware,
    async (req, res) => {
        console.log("Serving post request:", req.baseUrl);
        try {
            console.log(req.body);
            let receipt = await getReceiptWithParty(req.body.receiptId);
            return res.json(receipt);
        }
        catch (error) {
            console.log("Error while serving view receipt:", error)
        }
    }
);

router.post(
    '/print',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            console.log(req.body);
            let receipt = await getReceiptWithParty(req.body.receiptId);
            let business = await BusinessModel.findById(receipt.business);

            let orderDetails = prepareOrderDetailsForReceipt(receipt.payments);

            console.log(eval("`" + RECEIPT_HTML + "`"));
            return res.json(eval("`" + RECEIPT_HTML + "`"));

        } catch (error) {
            console.error(`Error while fetching Receipt`);
            console.log(error)
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
            let receipt = await ReceiptModel.findById(req.params.receipt_id);
            receipt.invalidated = true;
            let party = await PartyModel.findById(receipt.party);
            party.balance = party.balance - receipt.ammount;
            await receipt.save();
            await party.save();
            return res.json({ msg: 'Receipt Deleted successfully' });

        } catch (error) {
            console.error(`Error while deleting receipt: ${req.params.receipt_id}`);
            return res.status(500).send(error.message);
        }
    }
);

router.get('/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving new request search:", req.baseUrl);
        try {
            let receipts = await getReceiptDetails(req.user.business);

            res.json(receipts);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;