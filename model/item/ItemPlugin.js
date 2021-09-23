const mongoose = require('mongoose');

function searchByString(q, business, model, callback) {
    return model.find({
        business: mongoose.Types.ObjectId(business),
        stockPieces: { $gt: 0 },
        $or: [
            { huid: new RegExp(q, 'gi') },
            { name: new RegExp(q, 'gi') },
        ]
    }, callback).select({ 'name': 1, 'huid': 1, 'itemId': 1 });
};

function searchByItemId(q, business, callback) {
    return model.find({
        business: mongoose.Types.ObjectId(business),
        stockPieces: { $gt: 0 },
        "$expr": {
            "$regexMatch": {
                "input": { "$toString": "$itemId" },
                "regex": q
            }
        }
    }, callback).select({ 'name': 1, 'huid': 1, 'itemId': 1 });
};

function search(q, business, callback) {
    if (isNaN(q)) {
        return searchByString(q, business, this, callback);
    }
    return searchByItemId(q, business, this, callback);
};

function ItemQueriesPlugin(schema, options) {
    schema.statics.search = search;
}

module.exports = {
    ItemQueriesPlugin
}