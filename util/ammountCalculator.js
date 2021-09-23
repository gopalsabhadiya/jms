const { LabourTypeEnum, ExtraChargablesTypeEnum } = require("./enum");
const { roundTo } = require("./numberUtils");

const updateOrder = (order) => {
    try {
        let taxAmmount = 0;
        let netAmmount = 0;
        let scrapAmmount = 0;

        prepareOrder(order);

        for (let i = 0; i < order.items.length; i++) {
            updateItem(order.items[i]);
            netAmmount += order.items[i].netAmmount;
        }

        order.netAmmount = netAmmount;

        if (order.gst) {
            for (let gst of order.gst) {
                gst.ammount = gst.value * order.netAmmount * 0.01;
                taxAmmount += gst.ammount;
            }
        }

        order.totalAmmount = order.netAmmount + taxAmmount;

        if (order.scrap && order.scrap.netWeight && order.scrap.rate) {
            scrapAmmount = (order.scrap.netWeight * order.scrap.rate) / 10;
            order.scrap.netAmmount = scrapAmmount;
        } else {
            delete order.scrap;
        }

        order.scrapAmmount = scrapAmmount;
        order.finalAmmount = order.totalAmmount - order.scrapAmmount;
        order.billOutstanding = order.totalAmmount - order.scrapAmmount;

        if (order.billOutstanding === 0) {
            order.fulfilled = true;
        }

        if (order.kasar) {
            order.billOutstanding -= order.kasar;
        }
    } catch (err) {
        throw err;
    }
};

const updateItem = (item) => {
    try {
        item.extras = item.extras.filter((extra) => extra.type);

        let labourCharges = calculateLabourCharges(item);
        let extraCharges = calculateExtraCharges(item);
        let itemAmmount = item.netWeight * (item.rate / 10) * item.pieces;

        item.itemAmmount = itemAmmount;
        item.netAmmount = itemAmmount + labourCharges + extraCharges;

        (item.carat === 0 || !item.carat) && (item.carat = null);
    } catch (err) {
        throw err;
    }
};

const calculateLabourCharges = (item) => {
    try {
        if (item.labour) {
            switch (item.labour.type) {
                case LabourTypeEnum.PERCENTAGE:
                    return (
                        item.netWeight *
                        (item.rate / 10) *
                        item.pieces *
                        item.labour.value *
                        0.01
                    );
                case LabourTypeEnum.PER_GRAM:
                    return item.netWeight * item.labour.value * item.pieces;
                case LabourTypeEnum.TOTAL:
                    return item.labour.value;
                default:
                    break;
            }
        }
    } catch (err) {
        throw err;
    }
};

const calculateExtraCharges = (item) => {
    try {
        let extraCharges = 0;
        if (item.extras) {
            for (let extra of item.extras) {
                switch (extra.type) {
                    case ExtraChargablesTypeEnum.DAIMOND:
                        extraCharges +=
                            extra.rate * extra.pieces + extra.labourCharge * extra.pieces;
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
    } catch (err) {
        throw err;
    }
};

const prepareOrder = (order) => {
    try {
        for (let item of order.items) {
            item.grossWeight = parseFloat(item.grossWeight);
            item.netWeight = parseFloat(item.netWeight);
            item.carat = parseFloat(item.carat);
            item.rate = parseFloat(item.rate);
            if (item.labour && item.labour.value) {
                item.labour.value = parseFloat(item.labour.value);
            }
            for (let extra of item.extras) {
                extra.rate = extra.rate ? parseFloat(extra.rate) : 0;
                extra.labourCharge = extra.labourCharge
                    ? parseFloat(extra.labourCharge)
                    : 0;
                extra.pieces = extra.pieces ? parseFloat(extra.pieces) : 0;
            }
        }
        if (order.scrap && order.scrap.netWeight) {
            order.scrap.netWeight = parseFloat(order.scrap.netWeight);
            order.scrap.rate = parseFloat(order.scrap.rate);
        }
    } catch (err) {
        throw err;
    }
};

const roundOff = (order) => {
    try {
        order.netAmmount = roundTo(order.netAmmount, 0);
        order.totalAmmount = Math.round(order.totalAmmount, 0);
        order.scrapAmmount = Math.round(order.scrapAmmount, 0);
        order.finalAmmount = Math.round(order.finalAmmount, 0);
        order.billOutstanding = Math.round(order.billOutstanding, 0);
        if (order.scrap) {
            order.scrap.netAmmount = Math.round(order.scrap.netAmmount, 0);
        }
        for (let item of order.items) {
            item.netWeight = roundTo(item.netWeight, 3);
            item.grossWeight = roundTo(item.grossWeight, 3);
            item.netAmmount = Math.round(item.netAmmount, 0);
            item.itemAmmount = Math.round(item.itemAmmount, 0);
        }
        if (order.gst) {
            for (let gst of order.gst) {
                gst.ammount = roundTo(gst.ammount, 0);
            }
        }
    } catch (err) {
        throw err;
    }
};

module.exports = { updateOrder, updateItem, roundOff };
