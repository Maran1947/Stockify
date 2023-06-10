const router = require('express').Router();
const historicalController = require('../../controllers/historical/historicalController');

router.get('/get?',historicalController.get_historical_scrip_data);


module.exports = router;