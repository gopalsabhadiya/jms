const PartyTypeEnum = Object.freeze({ CUSTOMER: "Customer", RETAIL: "Retail" });
const BalanceTypeEnum = Object.freeze({ DEBIT: "Debit", CREDIT: "Credit" });
const LabourTypeEnum = Object.freeze({ PERCENTAGE: "Perentage", PER_GRAM: "Per Gram", TOTAL: "Total" });
const ExtraChargablesTypeEnum = Object.freeze({ HALL_MARK: "Hall Mark", DAIMOND: "Diamond", RHODIUM: "Rhodium" });

const GstTypeEnum = Object.freeze({ CGST: "CGST", SGST: "SGST" });

module.exports = {
    PartyTypeEnum,
    BalanceTypeEnum,
    LabourTypeEnum,
    GstTypeEnum,
    ExtraChargablesTypeEnum
}