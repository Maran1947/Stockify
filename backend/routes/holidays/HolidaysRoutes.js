const { get_market_holidays, get_and_save_market_holidays } = require('../../controllers/holidays/HolidaysController');

const router = require('express').Router();

router.get('/get', get_market_holidays);
router.put('/save', get_and_save_market_holidays);

module.exports = router;