const generateReceipt = (user, order, party) => {
    let receipt = {}
    receipt.user = user.id;
    receipt.business = user.business;
    receipt.order = order._id;
    receipt.party = party._id;
    receipt.ammount = order.payment.ammount;
    receipt.bank = order.payment.bank;
    receipt.mode = order.payment.type;
    receipt.panNo = order.payment.panNo;
    receipt.aadharNo = order.payment.aadharNo;
    console.log("Receipt:", receipt);
    return receipt;
}

module.exports = { generateReceipt }