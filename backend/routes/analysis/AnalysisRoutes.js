const router = require('express').Router();
const analysisController = require('../../controllers/analysis/AnalysisController');

router.get('/gl', analysisController.get_gainers_loosers);
router.put('/gl/save', analysisController.get_and_save_gainers_loosers);
router.get('/market-status', analysisController.get_market_status);
router.put('/market-status/save', analysisController.get_and_save_market_status);


module.exports = router;