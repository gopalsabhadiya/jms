const ItemModel = require("../model/gold_rate_history/GoldRateHistoryModel");

const createDailyGoldRate = async (user, dailyGoldRate) => {


    dailyGoldRate = new GoldRateHistoryModel(dailyGoldRate);

    var today = new Date();
    console.log(today);

    console.log(today.getFullYear().toString());
    console.log(today.getMonth().toString());
    console.log(today.getDate().toString());

    dailyGoldRate.dateOnly = parseInt(today.getFullYear().toString() + today.getMonth().toString() + today.getDate().toString());
    console.log(dailyGoldRate);

    dailyGoldRate.business = user.business;

    dailyGoldRate = await dailyGoldRate.save();

    return dailyGoldRate
};

const getTodayGoldRateByBusiness = async (businessId) => {
    console.log("Get TodayGoldRate by id..........")

    var today = new Date();
    var dateOnly = parseInt(today.getFullYear().toString() + today.getMonth().toString() + today.getDate().toString());

    let todayGoldRate = await GoldRateHistoryModel.find({business: businessId, dateOnly:  dateOnly});
    console.log(todayGoldRate)
    return todayGoldRate[0];
};

const updateTodayGoldRate = async (businessId, todayGoldRate) => {
    updatedGoldRate = await GoldRateHistoryModel.findOneAndUpdate({ _id: todayGoldRate._id }, todayGoldRate, { new: true });
    return updatedGoldRate;
};

module.exports =
{
    createDailyGoldRate,
    getTodayGoldRateByBusiness,
    updateTodayGoldRate,
}