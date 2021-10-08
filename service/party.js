const PartyModel = require("../model/party/PartyModel");
const { roundTo } = require("../util/numberUtils");

updatePartyForPlacedOrder = async (order) => {
    let party = await PartyModel.findById(order.party);
    if (party.balance > order.billOutstanding) {
        party.balance = party.balance - order.billOutstanding;
        order.billOutstanding = 0;
    }
    else {

        if (party.balance > 0) {
            order.billOutstanding = order.billOutstanding - party.balance;
            party.balance = 0 - order.billOutstanding
        }
        else {
            party.balance = party.balance - order.billOutstanding;
        }
    }

    party.balance = roundTo(party.balance, 0);
    await party.save();
};

updatePartyForUpdatedOrder = async (oldOrder, newOrder) => {
    console.log("Updating party for updated order...............", oldOrder.party)
    let party = await PartyModel.findById(oldOrder.party);
    party.balance = party.balance + oldOrder.billOutstanding - newOrder.billOutstanding;
    console.log("Updated Party:", party)

    await party.save();
};

updatePartyForDeletedOrder = async (order) => {
    let party = await PartyModel.findById(order.party);
    party.balance = party.balance + order.billOutstanding;
    await party.save();
};

module.exports = { updatePartyForPlacedOrder, updatePartyForDeletedOrder, updatePartyForUpdatedOrder };