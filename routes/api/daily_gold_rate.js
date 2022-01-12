const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const { createDailyGoldRate, getTodayGoldRateByBusiness, updateTodayGoldRate } = require('../../service/daily_gold_rate');

router.post(
    '/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            dailyGoldRate = await createDailyGoldRate(req.user, req.body);
            return res.json(dailyGoldRate);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.get(
    '/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            let todayGoldRate = await getTodayGoldRateByBusiness(req.user.business);
            return res.json(todayGoldRate);

        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.put(
    '/',
    authMiddleware,
    async (req, res) => {
        console.log("Serving request:", req.baseUrl);
        try {

            let updatedGoldRate = await updateTodayGoldRate(req.user.business, req.body);
            return res.json(updatedGoldRate);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Internal Server Error');
        }
    }
)

module.exports = router;