const mongoose = require('mongoose');

const receiptDetailsAggregate = [
    {
        '$match': {
            'business': '',
            invalidated: { $ne: true }
        }
    },
    {
        '$addFields': {
            'ammount': {
                '$sum': '$payments.ammount'
            }
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
            'receiptId':1,
            'paymentMode': 1,
            'ammount': 1,
            'activeAmmount': 1,
            'party': {
                'partyId': 1,
                'name': 1,
                'contactNo': 1,
                '_id': 1
            },
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

const viewReceiptAggregate = [
    {
        '$match': {
            '_id': '',
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
    }, {
        '$lookup': {
            'from': 'orders',
            'localField': 'payments.orderId',
            'foreignField': '_id',
            'as': 'orders'
        }
    }, {
        '$project': {
            'payments': 1,
            'ammount': 1,
            'activeAmmount': 1,
            'paymentMode': 1,
            'receiptId': 1,
            'business': 1,
            'date': 1,
            'party': {
                'name': 1,
                'contactNo': 1,
                'address': 1,
                'gstin': 1
            },
            'orders': {
                'orderId': 1,
                '_id': 1,
                'finalAmmount': 1,
                'date': {
                    '$dateToString': {
                        'format': '%d-%m-%Y',
                        'date': '$date'
                    }
                }
            }
        }
    }, {
        '$unwind': {
            'path': '$party'
        }
    }
];


function getReceiptDetails(businessId, skip, searchQuery, callback) {
    receiptDetailsAggregate[0]['$match']['business'] = mongoose.Types.ObjectId(businessId);
    receiptDetailsAggregate[5]['$match'] = searchQuery;
    receiptDetailsAggregate[7]['$skip'] = skip;

    return this.aggregate(receiptDetailsAggregate);
};

function getAllReceiptsById(receiptIds, callback) {
    receiptIds.map(id => mongoose.Types.ObjectId(id));
    console.log("receiptIds:", receiptIds);
    return this.find({
        _id: {
            $in: receiptIds
        }
    });
};

function getByIdWithPartyAndOrders(receiptId, callback) {
    viewReceiptAggregate[0]['$match']['_id'] = mongoose.Types.ObjectId(receiptId);
    return this.aggregate(viewReceiptAggregate);
};

function ReceiptQueriesPlugin(schema, options) {
    schema.statics.getDetails = getReceiptDetails;
    schema.statics.getAllById = getAllReceiptsById;
    schema.statics.getByIdWithPartyAndOrders = getByIdWithPartyAndOrders;
}


module.exports = {
    ReceiptQueriesPlugin
}