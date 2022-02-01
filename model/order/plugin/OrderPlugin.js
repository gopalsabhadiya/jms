const mongoose = require('mongoose');

const orderDetailsAggregate = [
    {
        '$match': {
            'business': '',
            invalidated: { $ne: true }
        }
    },
    {
        '$lookup': {
            'from': 'parties',
            'localField': 'party',
            'foreignField': '_id',
            'as': 'party'
        }
    },
    {
        '$project': {
            'billOutstanding': 1,
            'totalAmmount': 1,
            'orderId': 1,
            'fulfilled': 1,
            'party': {
                '_id': 1,
                'name': 1,
                'contactNo': 1
            },
            // 'date': {
            //     '$dateToString': {
            //         'format': '%d-%m-%Y',
            //         'date': '$date'
            //     }
            // }
            'date': 1,
        }
    },
    {
        '$unwind': {
            'path': '$party'
        }
    },
    {
        '$match': {

        }
    },
    {
        '$sort' : {
            '_id': -1
        }
    },
    {
        '$skip': 0
    },
    {
        '$limit': 20
    }
];


function getOrderDetails(businessId, skip, searchQuery, callback) {
    orderDetailsAggregate[0]['$match']['business'] = mongoose.Types.ObjectId(businessId);
    orderDetailsAggregate[4]['$match'] = searchQuery;
    orderDetailsAggregate[6]['$skip'] = skip;

    return this.aggregate(orderDetailsAggregate);
};

function updateReceipt(orderId, receiptId, callback) {
    return this.findByIdAndUpdate(orderId, { $push: { receipts: receiptId } }, callback);
}

function getUnpaidOrders(businessId, partId, callback) {
    return this.find({ business: mongoose.Types.ObjectId(businessId), fulfilled: false, invalidated: false });
}

function getAllOrdersById(orderIds, callback) {
    orderIds.map(id => mongoose.Types.ObjectId(id));
    console.log("OrderIds:", orderIds)
    return this.find({
        _id: {
            $in: orderIds
        }
    });
}

function OrderQueriesPlugin(schema, options) {
    schema.statics.getDetails = getOrderDetails;
    schema.statics.updateReceipt = updateReceipt;
    schema.statics.getUnpaidOrders = getUnpaidOrders;
    schema.statics.getAllById = getAllOrdersById;
}

module.exports = {
    OrderQueriesPlugin
}