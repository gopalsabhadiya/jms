const ItemModel = require("../model/item/ItemModel");
const { getNextItemCount } = require("./counter");

const createItem = async (user, item) => {
    item.extras = item.extras.filter(extra => extra.type);

    item = new ItemModel(item);

    item.itemId = await getNextItemCount(user.counter);
    item.name = item.category + " " + item.type;
    item.user = user.id;
    item.business = user.business;

    item = await item.save();

    return item
};

const updateItem = async (item) => {
    item = await ItemModel.findOneAndUpdate({ _id: item._id }, item, { new: true });
    return item;
};

const getItemById = async (itemId) => {
    console.log("Get Item by id..........")
    let item = await ItemModel.findById(itemId);
    return item;
};

const getItemByBusiness = async (businessId, skip, searchTerm) => {
    console.log('SearchTerm:' + searchTerm + skip);
    var query = {};
    query["business"] = businessId;
    query["stockPieces"] = {$gt: 0};
    if (searchTerm) {
        query.$or = [];
        query.$or.push({"name": new RegExp(searchTerm, 'gi')});
        query.$or.push({"huid": new RegExp(searchTerm, 'gi')});
        query.$or.push({"itemId": new RegExp(searchTerm, 'gi')});
        console.log(query);
    }
    return ItemModel.find(query).sort({"_id": -1}).skip(skip).limit(20);
};

const deleteItem = async (itemId) => {
    await ItemModel.findByIdAndRemove(itemId);
};

const searchItem = async (user, term) => {
    let items = await ItemModel.search(term, user.business, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            return data;
        }
    });
    return items;
};

module.exports =
{
    createItem,
    updateItem,
    getItemById,
    getItemByBusiness,
    deleteItem,
    searchItem
}