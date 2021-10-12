const CounterModel = require("../model/counter/CounterModel");

const getNextPartyCount = async (counterId) => {
    let counter = await CounterModel.findById(counterId);
    counter.party += 1;
    await counter.save();
    return counter.party;
};

const getNextItemCount = async (counterId) => {
    let counter = await CounterModel.findById(counterId);
    counter.item += 1;
    await counter.save();
    return counter.item;
};

const getNextOrderCount = async (counterId) => {
    let counter = await CounterModel.findById(counterId);
    counter.order += 1;
    await counter.save();
    return counter.order;
};

const getNextReceiptCount = async (counterId) => {
    console.log("Counter ID:", counterId)
    let counter = await CounterModel.findById(counterId);
    counter.receipt += 1;
    await counter.save();
    return counter.receipt;
};

module.exports =
{
    getNextPartyCount,
    getNextItemCount,
    getNextOrderCount,
    getNextReceiptCount
}