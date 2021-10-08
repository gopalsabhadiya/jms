const mongoose = require('mongoose');

const receiptDetailsAggregate = [
    {
        '$match': {
            'business': '',
            invalidated: { $ne: true }
        }
    }, {
        '$addFields': {
            'ammount': {
                '$sum': '$payments.ammount'
            }
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
            'paymentMode': 1,
            'ammount': 1,
            'party': {
                'partyId': 1,
                'name': 1,
                'contactNo': 1,
                '_id': 1
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


function getReceiptDetails(businessId, callback) {
    receiptDetailsAggregate[0]['$match']['business'] = mongoose.Types.ObjectId(businessId);

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

function ReceiptQueriesPlugin(schema, options) {
    schema.statics.getDetails = getReceiptDetails;
    schema.statics.getAllById = getAllReceiptsById;
}

module.exports = {
    ReceiptQueriesPlugin
}