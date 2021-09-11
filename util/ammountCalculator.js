const { LabourTypeEnum, ExtraChargablesTypeEnum } = require('./enum');


const updateOrder = (order, items) => {
    try {
        let taxAmmount = 0;
        let netAmmount = 0;
        let scrapAmmount = 0;

        prepareOrder(order, items);

        for (let i = 0; i < items.length; i++) {
            updateItem(items[i]);
            netAmmount += items[i].netAmmount;
        }

        order.netAmmount = netAmmount;

        if (order.gst) {
            console.log("into GST")
            for (let gst of order.gst) {
                taxAmmount += gst.value * order.netAmmount * 0.01;
            }
        }

        order.totalAmmount = order.netAmmount + taxAmmount;

        if (order.scrap) {
            scrapAmmount = order.scrap.netWeight * order.scrap.rate / 10;
            order.scrap.netAmmount = scrapAmmount;
        }

        order.scrapAmmount = scrapAmmount;
        order.finalAmmount = order.totalAmmount - order.scrapAmmount;
        order.billOutstanding = order.totalAmmount - order.scrapAmmount;


        if (order.kasar) {
            order.billOutstanding -= order.kasar;
        }

        roundOff(order, items);
    }
    catch (err) {
        throw err;
    }
}

const updateItem = (item) => {
    try {

        let labourCharges = calculateLabourCharges(item);
        let extraCharges = calculateExtraCharges(item);
        let itemAmmount = item.netWeight * item.rate / 10;

        console.log(itemAmmount);

        item.itemAmmount = itemAmmount;
        item.netAmmount = itemAmmount + labourCharges + extraCharges;
    }
    catch (err) {
        throw err;
    }

}

const calculateLabourCharges = (item) => {
    try {
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
    catch (err) {
        throw err;
    }
}

const calculateExtraCharges = (item) => {
    try {
        let extraCharges = 0;
        if (item.extras) {
            for (let extra of item.extras) {
                switch (extra.type) {
                    case ExtraChargablesTypeEnum.DAIMOND:
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
    catch (err) {
        throw err;
    }
}

const prepareOrder = (order, items) => {
    try {
        console.log("preparing order:", order);
        for (let item of items) {
            item.grossWeight = parseFloat(item.grossWeight);
            item.netWeight = parseFloat(item.netWeight);
            item.carat = parseFloat(item.carat);
            item.rate = parseFloat(item.rate);
            if (item.labour && item.labour.value) {
                item.labour.value = parseFloat(item.labour.value);
            }
            for (let extra of item.extras) {
                extra.rate = extra.rate ? parseFloat(extra.rate) : 0;
                extra.labourCharge = extra.labourCharge ? parseFloat(extra.labourCharge) : 0;
                extra.pieces = extra.pieces ? parseFloat(extra.pieces) : 0;
            }
        }
        if (order.scrap && order.scrap.netWeight) {
            order.scrap.netWeight = parseFloat(order.scrap.netWeight);
            order.scrap.rate = parseFloat(order.scrap.rate);
        }
        if (order.payment && order.payment.ammount) {
            order.payment.ammount = parseFloat(order.payment.ammount);
        }
        console.log("Prepared order:", order);
    } catch (err) {
        throw err;
    }
};


const roundOff = (order, items) => {
    try {
        console.log("Rounding off:", order);
        order.netAmmount = Math.round(order.netAmmount * 1e2) / 1e2;
        order.totalAmmount = Math.round(order.totalAmmount * 1e2) / 1e2;
        order.scrapAmmount = Math.round(order.scrapAmmount * 1e2) / 1e2;
        order.finalAmmount = Math.round(order.finalAmmount * 1e2) / 1e2;
        order.billOutstanding = Math.round(order.billOutstanding * 1e2) / 1e2;
        if (order.scrap) {
            order.scrap.netAmmount = Math.round(order.scrap.netAmmount * 1e2) / 1e2;
        }
        for (let item of items) {
            item.netAmmount = Math.round(item.netAmmount * 1e2) / 1e2;
            item.itemAmmount = Math.round(item.itemAmmount * 1e2) / 1e2;
        }
    }
    catch (err) {
        throw err;
    }
}
module.exports = { updateOrder, updateItem }