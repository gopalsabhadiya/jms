const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const PartyModel = require('../../model/party/PartyModel');
const { RECEIPT_HTML } = require('../../util/staticdata');
const ReceiptModel = require('../../model/receipt/ReceiptModel');
const { getReceiptDetails, createNewReceipt, getReceiptWithParty, deleteReceipt } = require('../../service/receipt');
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
            receipt = await getReceiptWithParty(receipt._id);

            return res.json(receipt);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

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
            console.log(error);
            return res.status(500).send('Internal Server Error');        }
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
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.delete(
    '/:receipt_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {
            await deleteReceipt(req.params.receipt_id);
            return res.json({ msg: 'Receipt Deleted successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving new request search:", req.baseUrl);
        try {
            let receipts = await getReceiptDetails(req.user.business);
            return res.json(receipts);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;