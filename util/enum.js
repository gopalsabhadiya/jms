const PartyTypeEnum = Object.freeze({ CUSTOMER: "Customer", RETAIL: "Retail" });
const BalanceTypeEnum = Object.freeze({ DEBIT: "Debit", CREDIT: "Credit" });
const LabourTypeEnum = Object.freeze({ PERCENTAGE: "PERCENTAGE", PER_GRAM: "PER_GRAM", TOTAL: "TOTAL" });
const ExtraChargablesTypeEnum = Object.freeze({ HALL_MARK: "Hall Mark", DAIMOND: "Diamond", RHODIUM: "Rhodium" });
const PaymentModeEnum = Object.freeze({ CHECK: "Check", CASH: "Cash", ONLINE: "Online" });
const PaymentTypeEnum = Object.freeze({ PAID: "Paid", RECEIVED: "Received" });
const ItemStatus = Object.freeze({ SOLD: "Sold", IN_STOCK: "In Stock" });


const GstTypeEnum = Object.freeze({ CGST: "CGST", SGST: "SGST" });

module.exports = {
    PartyTypeEnum,
    BalanceTypeEnum,
    LabourTypeEnum,
    GstTypeEnum,
    ExtraChargablesTypeEnum,
    PaymentModeEnum,
    PaymentTypeEnum,
    ItemStatus
}