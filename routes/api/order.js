const express = require('express');
const router = express.Router();
const validationMiddleware = require('../../middleware/validation/validate');
const authMiddleware = require('../../middleware/auth');
const { createOrder, deleteOrder, getOrder, getOrderDetailsByBusiness, updateOrder, getUnpaidOrders, getOrderById } = require('../../service/order');


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
            let order = await createOrder(req.user, req.body);
            res.json(order);

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

            deleteOrder(req.user, req.params.order_id)

            return res.json({ msg: 'Order Deleted successfully' });

        } catch (error) {
            console.error(`Error while fetching User: ${req.user.id}`);
            console.log(error)
            return res.status(500).send(error.message);
        }
    }
);

router.put(
    '/',
    [authMiddleware, validationMiddleware],
    async (req, res) => {
        console.log("Serving put request:", req.baseUrl);

        try {
            let updatedOrder = await updateOrder(req.user, req.body);
            return res.json(updatedOrder);
        } catch (error) {
            console.error('Error while updating order:', error);

        }

    }
);

router.post(
    '/view',
    authMiddleware,
    async (req, res) => {
        console.log("Serving post request:", req.baseUrl);
        try {
            let order = await getOrder(req.body.orderId);
            return res.json(order);
        }
        catch (error) {
            console.log("Error while serving view order:", error)
        }
    }
);


router.get(
    '/details',
    authMiddleware,
    async (req, res) => {
        console.log("Serving get request:", req.baseUrl);
        try {
            let orderDetails = await getOrderDetailsByBusiness(req.user.business, parseInt(req.query.skip), req.query.searchTerm);
            return res.json(orderDetails);
        } catch (error) {
            console.log("Error while fetching order details:", error)
        }
    }
);

router.get(
    '/id/:order_id',
    authMiddleware,
    async (req, res) => {
        console.log("Serving get request:", req.baseUrl);
        try {
            let orderDetails = await getOrderById(req.user.business, req.params.order_id);
            console.log("Order:"+JSON.stringify(orderDetails));
            return res.json(orderDetails);
        } catch (error) {
            console.log("Error while fetching order details:", error)
        }
    }
);

router.post(
    '/unpaid',
    authMiddleware,
    async (req, res) => {
        console.log("Serving get request:", req.baseUrl);
        try {
            let unpaidOrders = await getUnpaidOrders(req.user, req.body.partyId);
            return res.json(unpaidOrders);
        } catch (error) {
            console.log("Error while fetching order details:", error)
        }
    }
);
module.exports = router;