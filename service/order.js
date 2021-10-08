const OrderModel = require("../model/order/OrderModel");
const { calculateOrder, roundOff } = require("../util/ammountCalculator");
const { updateInventoryForPlacedOrder, updateInventoryForDeletedOrder } = require("./inventory");
const { updatePartyForPlacedOrder, updatePartyForDeletedOrder, updatePartyForUpdatedOrder } = require("./party");
const { createReceiptForSinglePayment, updateReceiptForDeletdOrder } = require("./receipt");

const createOrder = async (user, order) => {

    console.log('Creating new order.............');

    calculateOrder(order);

    order.user = user.id;
    order.business = user.business;

    let orderModel = new OrderModel(order);

    createReceiptForSinglePayment(user, order.payment, orderModel);
    updateInventoryForPlacedOrder(orderModel.items);
    updatePartyForPlacedOrder(orderModel);

    console.log(orderModel.billOutstanding);
    console.log(orderModel.billOutstanding < 1);
    if (orderModel.billOutstanding < 1) {
        orderModel.fulfilled = true;
    }
    roundOff(orderModel);

    await orderModel.save();

    return orderModel._id;
};

const deleteOrder = async (user, orderId) => {
    console.log('Deleting order.............');

    let order = await OrderModel.findById(orderId);

    updateReceiptForDeletdOrder(order);
    updatePartyForDeletedOrder(order);
    updateInventoryForDeletedOrder(order.items);

    order.invalidated = true;
    order.deletedBy = user.id;

    await order.save();
};

const getOrder = async (orderId) => {
    console.log('Serving order.............');

    let order = await OrderModel.findById(orderId);
    return order;
};

const getOrderDetails = async (businessId) => {
    console.log('Serving order details.............');

    let orderDetails = await OrderModel.getDetails(businessId);
    return orderDetails;
}

const updateOrder = async (user, order) => {
    console.log('Updating order.............');

    let oldOrder = await OrderModel.findById(order._id);

    calculateOrder(order);
    roundOff(order);

    order.billOutstanding = order.billOutstanding - (oldOrder.totalAmmount - oldOrder.billOutstanding);

    delete order.date;

    order.party = oldOrder.party;
    updatePartyForUpdatedOrder(oldOrder, order);

    let updatedOrder = await OrderModel.findOneAndUpdate({ _id: order._id }, order, { new: true });
    return updatedOrder;

};

const getUnpaidOrders = async (user, partyId) => {
    console.log("Serving unpaid orders...........");
    const unpaidOrders = await OrderModel.getUnpaidOrders(user.business, partyId);
    return unpaidOrders;
}

const updateOrderForPayment = async (receipt) => {
    console.log("Updating orders for payment............");

    let orderIds = receipt.payments.map(payment => payment.orderId);

    let orders = await OrderModel.getAllById(orderIds);

    for (let order of orders) {
        let oldOrder = { ...order._doc };
        let payment = receipt.payments.filter(payment => payment.orderId.equals(order._id.toString()));
        if (payment[0].ammount === order.billOutstanding) {
            order.fulfilled = true;
            order.billOutstanding = 0;
        }
        else {
            order.billOutstanding -= payment[0].ammount;
        }
        order.receipts.push(receipt._id);
        await order.save();
        updatePartyForUpdatedOrder(oldOrder, order);
    }
    return orders;

}

module.exports =
{
    createOrder,
    deleteOrder,
    getOrder,
    getOrderDetails,
    updateOrder,
    getUnpaidOrders,
    updateOrderForPayment
};
