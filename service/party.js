const PartyModel = require("../model/party/PartyModel");
const { roundTo } = require("../util/numberUtils");
const { getNextPartyCount } = require("./counter");

const createParty = async (user, party) => {
    let partyModel = new PartyModel(party);

    partyModel.partyId = await getNextPartyCount(user.counter);

    partyModel.type = "Retail";
    partyModel.user = user.id;
    partyModel.business = user.business

    await partyModel.save();

    return partyModel;
};

const updateParty = async (party) => {
    party = await PartyModel.findOneAndUpdate({ _id: party._id }, party, { new: true });
    return party;
};

const getPartyById = async (partyId) => {
    let party = await PartyModel.findById(partyId);
    return party;
};

const getPartyByBusiness = async (businessId) => {
    let parties = await PartyModel.find({ business: businessId });
    return parties;
};

const deleteParty = async (partyId) => {
    await PartyModel.findByIdAndRemove(partyId);
    return null;
}

const searchParty = async (user, term) => {
    let party = await PartyModel.search(term, user.business, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            return data;
        }
    });
    return party;
}

const updatePartyForPlacedOrder = async (order) => {
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

const updatePartyForUpdatedOrder = async (oldOrder, newOrder) => {
    console.log("Updating party for updated order...............", oldOrder.party)
    let party = await PartyModel.findById(oldOrder.party);
    party.balance = party.balance + oldOrder.billOutstanding - newOrder.billOutstanding;
    await party.save();
};

const updatePartyForDeletedOrder = async (order) => {
    let party = await PartyModel.findById(order.party);
    party.balance = party.balance + order.billOutstanding;
    await party.save();
};

module.exports =
{
    updatePartyForPlacedOrder,
    updatePartyForDeletedOrder,
    updatePartyForUpdatedOrder,
    createParty,
    updateParty,
    getPartyById,
    getPartyByBusiness,
    searchParty,
    deleteParty
};