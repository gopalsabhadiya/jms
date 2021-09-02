const { LabourTypeEnum, ExtraChargablesTypeEnum } = require('./enum');


const updateOrder = (order) => {
    let taxAmmount = 0;
    let netAmmount = 0;
    let scrapAmmount = 0;

    for (let i = 0; i < order.items.length; i++) {
        updateItem(order.items[i]);
        netAmmount += order.items[i].netAmmount;
    }

    order.netAmmount = netAmmount;

    if (order.gst) {
        console.log("into GST")
        for (let gst of order.gst) {
            console.log(gst.value, order.netAmmount, 0.01)
            taxAmmount += gst.value * order.netAmmount * 0.01;
        }
    }

    order.totalAmmount = order.netAmmount + taxAmmount;

    console.log('tax Ammount:', taxAmmount, "netAmmount:", order.netAmmount, "totalAmmount:", order.totalAmmount);


    if (order.scrap) {
        scrapAmmount = order.scrap.netWeight * order.scrap.rate / 10;
    }

    order.scrap.netAmmount = scrapAmmount;
    order.scrapAmmount = scrapAmmount;
    order.finalAmmount = order.totalAmmount - order.scrapAmmount;
    order.billOutstanding = order.totalAmmount - order.scrapAmmount;

    console.log("BillOutstanding:", order.billOutstanding)

    if (order.kasar) {
        order.billOutstanding -= order.kasar;
    }
}

const updateItem = (item) => {

    let labourCharges = calculateLabourCharges(item);
    let extraCharges = calculateExtraCharges(item);
    let itemAmmount = item.netWeight * item.rate / 10;

    item.itemAmmount = itemAmmount;
    item.netAmmount = itemAmmount + labourCharges + extraCharges;

    console.log("Updated Item:", item.name, item.itemAmmount, item.netAmmount, labourCharges, extraCharges);
}

const calculateLabourCharges = (item) => {
    if (item.labour) {
        switch (item.labour.type) {
            case LabourTypeEnum.PERCENTAGE:
                return (item.netWeight * item.rate / 10) * item.labour.value * 0.01;
            case LabourTypeEnum.PER_GRAM:
                return item.netWeight * item.labour.value;
            case LabourTypeEnum.TOTAL:
                return item.labour.value;
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
                    console.log('Diamond Charge: ', extra.rate * extra.pieces + extra.labourCharge * extra.pieces);
                    extraCharges += extra.rate * extra.pieces + extra.labourCharge * extra.pieces;
                    break;
                case ExtraChargablesTypeEnum.HALL_MARK:
                    extraCharges += extra.rate;
                    break;
                case ExtraChargablesTypeEnum.RHODIUM:
                    extraCharges += extra.rate;
                    break;
                default:
                    break;
            }
        }
    }
    return extraCharges;
}

module.exports = { updateOrder, updateItem }