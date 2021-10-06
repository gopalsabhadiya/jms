const PaymentModel = require("../model/receipt/PaymentModel");
const ReceiptModel = require("../model/receipt/ReceiptModel");
const { PaymentTypeEnum } = require("../util/enum");

const createPayment = async (user, receipt, orders) => {
    receipt.user = user.id;
    receipt.business = user.business;
    receipt.orders = orders.map(order => order._id);
    let receiptModel = new ReceiptModel(receipt);
    await ReceiptModel.save(receipt);
};

const createReceiptForSinglePayment = async (user, payment, order) => {

    if (
        payment
        && payment.ammount
        && payment.ammount !== 0
        && payment.type
    ) {
        console.log(payment);
        let paymentModel = new PaymentModel(payment);
        let receipt = new ReceiptModel();

        paymentModel.orderId = order._id;
        receipt.paymentMode = payment.type;
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

        await receipt.save();
    }
};

const updateReceiptForDeletdOrder = async (order) => {
    let receipts = await ReceiptModel.getAllById(order.receipts);

    for (let receipt of receipts) {
        let receiptInvalidated = true;
        for (let payment of receipt.payments) {
            if (payment.orderId.toString() === order._id.toString()) {
                payment.invalidated = true;
            }
            else {
                receiptInvalidated = false;
            }
        }
        receipt.invalidated = receiptInvalidated;
        await receipt.save();
    }
};

const getReceiptDetails = async (businessId) => {
    console.log('Serving receipt details.............');

    let receiptDetails = await ReceiptModel.getDetails(businessId);
    return receiptDetails;
}

module.exports = { createPayment, createReceiptForSinglePayment, updateReceiptForDeletdOrder, getReceiptDetails };
