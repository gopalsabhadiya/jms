const mongoose = require('mongoose');

const orderDetailsAggregate = [
    {
        '$match': {
            'business': '',
            invalidated: { $ne: true }
        }
    }, {
        '$lookup': {
            'from': 'parties',
            'localField': 'party',
            'foreignField': '_id',
            'as': 'party'
        }
    }, {
        '$project': {
            'billOutstanding': 1,
            'totalAmmount': 1,
            'orderId': 1,
            'fulfilled': 1,
            'party': {
                'name': 1,
                'contactNo': 1
            },
            'date': {
                '$dateToString': {
                    'format': '%d-%m-%Y',
                    'date': '$date'
                }
            }
        }
    }, {
        '$unwind': {
            'path': '$party'
        }
    }
];


function getOrderDetails(businessId, callback) {
    orderDetailsAggregate[0]['$match']['business'] = mongoose.Types.ObjectId(businessId);

    return this.aggregate(orderDetailsAggregate);
};

function updateReceipt(orderId, receiptId, callback) {
    return this.findByIdAndUpdate(orderId, { $push: { receipts: receiptId } }, callback);
}

function getUnpaidOrders(businessId, partId, callback) {
    return this.find({ business: mongoose.Types.ObjectId(businessId), fulfilled: false }).select({ orderId: 1, finalAmmount: 1, billOutstanding: 1 })
}

function OrderQueriesPlugin(schema, options) {
    schema.statics.getDetails = getOrderDetails;
    schema.statics.updateReceipt = updateReceipt;
    schema.statics.getUnpaidOrders = getUnpaidOrders;
}

module.exports = {
    OrderQueriesPlugin
}