module.exports = {};

const PaymentModel = require("../model/receipt/PaymentModel");
const ReceiptModel = require("../model/receipt/ReceiptModel");
const { PaymentTypeEnum } = require("../util/enum");
const { getNextReceiptCount } = require("./counter");
const orderService = import("./order.js");

const createReceiptForSinglePayment = async (user, payment, order) => {

    console.log("Creating receipt for singl order payment.................");

    if (
        payment
        && payment.ammount
        && payment.ammount !== 0
        && payment.paymentMode
    ) {
        let paymentModel = new PaymentModel(payment);
        let receipt = new ReceiptModel();

        receipt.receiptId = await getNextReceiptCount(user.counter);
        paymentModel.orderId = order._id;
        receipt.ammount = paymentModel.ammount;
        receipt.activeAmmount = receipt.ammount;
        receipt.paymentMode = payment.paymentMode;
        receipt.bank = payment.bank;
        receipt.check = payment.check;
        receipt.pan = payment.pan;
        receipt.aadhar = payment.aadhar;
        receipt.payments = [paymentModel];
        receipt.business = user.business;
        receipt.user = user.id;
        receipt.party = order.party;
        receipt.paymentType = PaymentTypeEnum.RECEIVED;

        order.receipts = [receipt._id];
        order.billOutstanding -= paymentModel.ammount;

        receipt = await receipt.save();
    }
};

const updateReceiptForDeletdOrder = async (order) => {
    console.log("Updating receipt for deleted order.......");

    let receipts = await ReceiptModel.getAllById(order.receipts);

    for (let receipt of receipts) {
        let receiptInvalidated = true;
        console.log("Updating receipt:", receipt.ammount)
        for (let payment of receipt.payments) {
            if (payment.orderId.equals(order._id.toString())) {
                console.log("Into if")
                payment.invalidated = true;
                receipt.activeAmmount -= payment.ammount;
            }
            else if (!payment.invalidated) {
                console.log("Into else if")
                receiptInvalidated = false;
            }
            console.log("Payment Invalidated:", payment.invalidated);

        }
        receipt.invalidated = receiptInvalidated;
        console.log("ReceiptInvalidated:", receiptInvalidated)
        await receipt.save();
    }
};

const getReceiptDetails = async (businessId) => {
    console.log('Serving receipt details.............');

    let receiptDetails = await ReceiptModel.getDetails(businessId);
    return receiptDetails;
}

const createNewReceipt = async (user, receipt) => {
    console.log('Serving create receipt..........');
    let payments = receipt.payments.map(payment => {
        delete payment.orderId;
        const { _id: orderId, ...rest } = payment;
        return { orderId, ...rest };
    });
    receipt.activeAmmount = receipt.ammount;
    receipt.payments = payments;
    receipt.business = user.business;
    receipt.user = user.id;
    receipt.paymentType = PaymentTypeEnum.RECEIVED;

    let receiptModel = new ReceiptModel(receipt);
    receiptModel.receiptId = await getNextReceiptCount(user.counter);

    await (await orderService).updateOrderForPayment(receiptModel);

    await receiptModel.save();
    return receiptModel;

};

const deleteReceipt = async (receiptId) => {
    console.log("Deleting receipt...........");

    let receipt = await ReceiptModel.findById(receiptId);
    receipt.invalidated = true;

    let {updateOrdersForDeletedReceipt} = require('./order');
    await updateOrdersForDeletedReceipt(receipt);

    await receipt.save();
}

const getReceiptWithParty = async (receptId) => {
    console.log('Serving receipt.............');

    let receipt = await ReceiptModel.getByIdWithPartyAndOrders(receptId);
    receipt = receipt[0];
    console.log(receipt);

    for (let payment of receipt.payments) {
        for (let order of receipt.orders) {
            if (payment.orderId.toString() == order._id.toString()) {
                payment.order = order;
            }
        }
    }
    return receipt;
};

module.exports =
{
    createReceiptForSinglePayment,
    updateReceiptForDeletdOrder,
    getReceiptDetails,
    createNewReceipt,
    getReceiptWithParty,
    deleteReceipt
};
