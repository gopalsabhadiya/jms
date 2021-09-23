const mongoose = require('mongoose');

function getAllReceiptsById(receiptIds, callback) {
    receiptIds.map(id => mongoose.Types.ObjectId(id));
    return this.find({
        _id: {
            $in: receiptIds
        }
    });
};

function ReceiptQueriesPlugin(schema, options) {
    schema.statics.getAllById = getAllReceiptsById;
}

module.exports = {
    ReceiptQueriesPlugin
}