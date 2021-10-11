const prepareOrderDetailsForReceipt = (payments) => {
    let orderTableData = '';
    for (let payment of payments) {
        orderTableData +=
            '<tr>' +
            '<td style="font-size: 15px;">' + payment.order.orderId + '</td>' +
            '<td style="font-size: 15px;">' + payment.order.finalAmmount + '</td>' +
            '<td style="font-size: 15px;">' + payment.order.date + '</td>' +
            '<td style="font-size: 15px;">' + payment.ammount + '</td>' +
            '<td style="font-size: 15px;">' + (payment.invalidated ? 'Cancelled' : 'Active') + '</td>' +
            '</tr>';
    }
    return orderTableData;
};

module.exports =
{
    prepareOrderDetailsForReceipt
}