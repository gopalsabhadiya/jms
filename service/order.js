const OrderModel = require("../model/order/OrderModel");
const PartyModel = require("../model/party/PartyModel");
const ReceiptModel = require("../model/receipt/ReceiptModel");
const { updateOrder, roundOff } = require("../util/ammountCalculator");
const { updateInventoryForPlacedOrder } = require("./inventory");
const { updatePartyForPlacedOrder } = require("./party");
const { createReceiptForSinglePayment } = require("./receipt");

createOrder = async (user, order) => {

    updateOrder(order);

    order.user = user.id;
    order.business = user.business;

    let orderModel = new OrderModel(order);

    createReceiptForSinglePayment(user, order.payment, orderModel);
    updateInventoryForPlacedOrder(orderModel);
    updatePartyForPlacedOrder(orderModel);

    roundOff(orderModel);

    await orderModel.save();

    return orderModel._id;
};

deleteOrder = async (user, orderId) => {

    let order = await OrderModel.findById(orderId);
    let receipts = await ReceiptModel.getAllById(order.receipts);
    let party = await PartyModel.findById(order.party);
    let payableAmmount = 0;

    for (let receipt of receipts) {
        for (let payment of receipt) {
            if (payment.orderId === order._id) {
                payment.invalidated = true;
            }
        }
    }



    order.invalidated = true;
    order.deletedBy = user.id;
};

module.exports = { createOrder };
