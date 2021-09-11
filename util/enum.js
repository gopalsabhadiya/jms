const PartyTypeEnum = Object.freeze({ CUSTOMER: "Customer", RETAIL: "Retail" });
const BalanceTypeEnum = Object.freeze({ DEBIT: "Debit", CREDIT: "Credit" });
const LabourTypeEnum = Object.freeze({ PERCENTAGE: "Percentage", PER_GRAM: "Per Gram", TOTAL: "Total" });
const ExtraChargablesTypeEnum = Object.freeze({ HALL_MARK: "Hall Mark", DAIMOND: "Diamond", RHODIUM: "Rhodium" });
const PaymentTypeEnum = Object.freeze({ CHECK: "Check", CASH: "Cash", ONLINE: "Online" });
const ItemStatus = Object.freeze({ SOLD: "Sold", IN_STOCK: "In Stock" });


const GstTypeEnum = Object.freeze({ CGST: "CGST", SGST: "SGST" });

module.exports = {
    PartyTypeEnum,
    BalanceTypeEnum,
    LabourTypeEnum,
    GstTypeEnum,
    ExtraChargablesTypeEnum,
    PaymentTypeEnum,
    ItemStatus
}