const PaymentModel = require("../model/receipt/PaymentModel");
const ReceiptModel = require("../model/receipt/ReceiptModel");
const { PaymentTypeEnum } = require("../util/enum");

const createPayment = async (user, receipt, orders) => {
    receipt.user = user.id;
    receipt.business = user.business;
    receipt.orders = orders.map(order => order._id);
    let receiptModel = new ReceiptModel(receipt);
    await ReceiptModel.save(receipt);
}

const createReceiptForSinglePayment = async (user, payment, order) => {

    if (
        payment
        && payment.ammount
        && payment.ammount !== 0
        && payment.type
    ) {
        let paymentModel = new PaymentModel(payment);
        let receipt = new ReceiptModel();

        paymentModel.orderId = order._id;
        receipt.payments = [paymentModel];
        receipt.business = user.business;
        receipt.user = user.id;
        receipt.party = order.party;
        receipt.paymentType = PaymentTypeEnum.RECEIVED;

        order.receipts = [receipt._id];
        order.billOutstanding -= paymentModel.ammount;
        console.log("BillOutstanding in payment:", order.billOutstanding)

        await receipt.save();
    }

}

module.exports = { createPayment, createReceiptForSinglePayment };
