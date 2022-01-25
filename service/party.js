const PartyModel = require("../model/party/PartyModel");
const { roundTo } = require("../util/numberUtils");
const { getNextPartyCount } = require("./counter");
const mongoose = require('mongoose');


const createParty = async (user, party) => {
    console.log("Party Creating: " + JSON.stringify(party));
    let partyModel = new PartyModel(party);

    partyModel.partyId = await getNextPartyCount(user.counter);

    partyModel.user = user.id;
    partyModel.business = user.business

    return await partyModel.save();

};

const updateParty = async (party) => {
    party = await PartyModel.findOneAndUpdate({ _id: party._id }, party, { new: true });
    return party;
};

const getPartyById = async (businessId, partyId) => {
    let party = await PartyModel.findOne({"business": businessId, "_id": partyId});
    return party;
};

const getPartyByBusiness = async (businessId, skip, searchTerm) => {
    console.log('SearchTerm:' + searchTerm + skip);
    var query = {};
    query["business"] = businessId;
    if (searchTerm) {
        query.$or = [];
        query.$or.push({"name": new RegExp(searchTerm, 'gi')});
        query.$or.push({"contactNo": new RegExp(searchTerm, 'gi')});
        query.$or.push({"gstin": new RegExp(searchTerm, 'gi')});
        query.$or.push({"partyId": new RegExp(searchTerm, 'gi')});
        console.log(query);
    }
    let parties = await PartyModel.find(query).sort({"_id":-1}).skip(skip).limit(20);
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

const updatePartyForReceipt = async (receipt) => {
    console.log("Updating party for excess ammount.........");
    let party = await PartyModel.findById(receipt.party);
    const excessAmmount = receipt.payments.reduce(
        (excessAmmount, payment) => excessAmmount -= payment.ammount,
        receipt.ammount
    );
    party.balance += excessAmmount;
    await party.save();
}

const getFirstParty = async (businessId) => {
    let party = await PartyModel.find({ business: businessId }).sort({"_id":-1}).limit(1);
    return party[0];
};

const getNextParty = async (businessId, previousPartyId) => {
    let allParties = await PartyModel.find({business: businessId, _id: {"$lt": mongoose.Types.ObjectId(previousPartyId)}});
    let party = await PartyModel.find({business: businessId, _id: {$lt: mongoose.Types.ObjectId(previousPartyId)}}).sort({"_id":-1}).limit(1);
    return party[0];
}

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
    deleteParty,
    updatePartyForReceipt,
    getFirstParty,
    getNextParty
};