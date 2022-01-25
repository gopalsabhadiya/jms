const ItemModel = require("../model/item/ItemModel");
const { ItemAlreadySoldException } = require("../util/exceptions/itemSoldException");
const { createItem } = require("./item");


const updateInventoryForPlacedOrder = async (user, items) => {
    console.log("Updating Inventory................ ");
    console.log(items);
    let itemsToBeUpdated = [];

    for (let item of items) {
        let stockItem = null;
        if (item._id) {
            stockItem = await ItemModel.findById(item._id);
            if (stockItem.stockPieces === 0) {
                throw new ItemAlreadySoldException();
            }
            stockItem.stockPieces > item.pieces
                ? (stockItem.stockPieces = stockItem.stockPieces - item.pieces)
                : (stockItem.stockPieces = 0);
        } else {
            stockItem = await createItem(user, item);
        }

        item.stockItemId = stockItem._id;
        item.name = stockItem.name;

        itemsToBeUpdated.push(stockItem);
    }

    for (let item of itemsToBeUpdated) {
        item = await item.save();
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
