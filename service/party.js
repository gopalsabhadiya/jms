const PartyModel = require("../model/party/PartyModel");
const { roundTo } = require("../util/numberUtils");

updatePartyForPlacedOrder = async (order) => {
    let party = await PartyModel.findById(order.party);
    if (party.balance > order.billOutstanding) {
        console.log("Party balance greater than bill outstanding")
        party.balance = party.balance - order.billOutstanding;
        order.billOutstanding = 0;
    }
    else {
        console.log("Party balance less than or equal bill outstanding")

        if (party.balance > 0) {
            console.log("Party balance less than zero bill outstanding")

            order.billOutstanding = order.billOutstanding - party.balance;
            party.balance = 0 - order.billOutstanding
        }
        else {
            console.log("Party balance greater than zero bill outstanding");
            console.log(order.billOutstanding);

            party.balance = party.balance - order.billOutstanding;
        }
    }

    party.balance = roundTo(party.balance, 0);
    await party.save();
}

module.exports = { updatePartyForPlacedOrder };