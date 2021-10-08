const ItemModel = require("../model/item/ItemModel");
const { ItemAlreadySoldException } = require("../util/exceptions/itemSoldException");

const updateInventoryForPlacedOrder = async (items) => {
    console.log("Updating Inventory................")
    let itemsToBeUpdated = [];

    for (let item of items) {
        let stockItem = null;
        if (item.stockItemId) {
            stockItem = await ItemModel.findById(item.stockItemId);
            if (stockItem.stockPieces === 0) {
                throw new ItemAlreadySoldException();
            }
            stockItem.stockPieces > item.pieces
                ? (stockItem.stockPieces = stockItem.stockPieces - item.pieces)
                : (stockItem.stockPieces = 0);
        } else {
            stockItem = new ItemModel(item);
            item.stockItemId = stockItem._id;
        }
        itemsToBeUpdated.push(stockItem);
    }

    for (let item of itemsToBeUpdated) {
        item = await item.save();;
    }

}

const updateInventoryForDeletedOrder = async (items) => {

    let itemsFromDb = await ItemModel.getAllById(items);

    for (let [index, item] of itemsFromDb.entries()) {
        item.stockPieces = item.stockPieces + parseInt(items[index].pieces);
        await item.save();
    }
}

module.exports = { updateInventoryForPlacedOrder, updateInventoryForDeletedOrder };
