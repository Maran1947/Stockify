const authRoutes = require('./authentication/AuthenticationRoutes');
const scriptRoutes = require('./script/ScriptRoutes');
const watchlistRoutes = require('./watchlist/watchlistRoutes');
const userStockRoutes = require('./userStock/UserStockRoutes');
const orderRoutes = require('./order/orderRoutes');
const analysisRoutes = require('./analysis/AnalysisRoutes.js');
const positionRoutes = require('./position/PositionRoutes.js');
const historicalRoutes = require('./historical/HistoricalRoutes.js');
const holidaysRoutes = require('./holidays/HolidaysRoutes.js');
const express = require('express');
const router = express.Router();

router.use('/api/user', authRoutes);
router.use('/api/scrip', scriptRoutes);
router.use('/api/watchlist', watchlistRoutes);
router.use('/api/stock', userStockRoutes);
router.use('/api/order', orderRoutes);
router.use('/api/analysis', analysisRoutes)
router.use('/api/position', positionRoutes);
router.use('/api/historical', historicalRoutes);
router.use('/api/market-holidays', holidaysRoutes);

module.exports = router;