const { LabourTypeEnum, ExtraChargablesTypeEnum } = require('./enum');


const updateOrder = (order) => {
    let taxAmmount = 0;
    let netAmmount = 0;
    let scrapAmmount = 0;

    for (let i = 0; i < order.items.length; i++) {
        updateItem(order.items[i]);
        netAmmount += (order.items[i].netAmmount).toFixed(2);
    }

    order.netAmmount = netAmmount;

    if (order.gst) {
        console.log("into GST")
        for (let gst of order.gst) {
            taxAmmount += (gst.value * order.netAmmount * 0.01).toFixed(2);
        }
    }

    order.totalAmmount = (order.netAmmount + taxAmmount).toFixed(2);



    if (order.scrap) {
        scrapAmmount = (order.scrap.netWeight * order.scrap.rate / 10).toFixed(2);
        order.scrap.netAmmount = scrapAmmount;
    }

    order.scrapAmmount = scrapAmmount;
    order.finalAmmount = (order.totalAmmount - order.scrapAmmount).toFixed(2);
    order.billOutstanding = (order.totalAmmount - order.scrapAmmount).toFixed(2);


    if (order.kasar) {
        order.billOutstanding -= (order.kasar).toFixed(2);
    }
}

const updateItem = (item) => {

    let labourCharges = calculateLabourCharges(item);
    let extraCharges = calculateExtraCharges(item);
    let itemAmmount = (item.netWeight * item.rate / 10).toFixed(2);

    item.itemAmmount = itemAmmount.toFixed(2);
    item.netAmmount = (itemAmmount + labourCharges + extraCharges).toFixed(2);

}

const calculateLabourCharges = (item) => {
    if (item.labour) {
        switch (item.labour.type) {
            case LabourTypeEnum.PERCENTAGE:
                return ((item.netWeight * item.rate / 10) * item.labour.value * 0.01).toFixed(2);
            case LabourTypeEnum.PER_GRAM:
                return (item.netWeight * item.labour.value).toFixed(2);
            case LabourTypeEnum.TOTAL:
                return (item.labour.value).toFixed(2);
            default:
                break;
        }
    }
}

const calculateExtraCharges = (item) => {
    let extraCharges = 0;
    if (item.extras) {
        for (let extra of item.extras) {
            switch (extra.type) {
                case ExtraChargablesTypeEnum.DAIMOND:
                    extraCharges += (extra.rate * extra.pieces + extra.labourCharge * extra.pieces).toFixed(2);
                    break;
                case ExtraChargablesTypeEnum.HALL_MARK:
                    extraCharges += (extra.rate).toFixed(2);
                    break;
                case ExtraChargablesTypeEnum.RHODIUM:
                    extraCharges += (extra.rate).toFixed(2);
                    break;
                default:
                    break;
            }
        }
    }
    return extraCharges;
}

module.exports = { updateOrder, updateItem }