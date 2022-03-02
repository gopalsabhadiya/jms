
const calculateBusinessState = (business) => {
    let businessStats = {};
    let totalTypes = 0;
    console.log(business.itemCollection.size);
    businessStats.totalCategories = business.itemCollection.size;
    businessStats.categoryViseType = {};
    business.itemCollection.forEach((values,keys)=>{
        totalTypes += values.length;
        businessStats.categoryViseType[keys] = values.length;
    })
    businessStats.totalTypes = totalTypes;
    return businessStats;
};

module.exports =
    {
        calculateBusinessState,
    }