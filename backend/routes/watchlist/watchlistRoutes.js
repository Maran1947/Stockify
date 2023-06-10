const router = require('express').Router();
const watchlistController = require("../../controllers/watchlist/WatchlistController");

router.post('/add', watchlistController.add_script_in_watchlist);
router.get('/get?', watchlistController.get_watchlist_by_userId);
router.delete('/remove?', watchlistController.remove_watchlist_scrip);

module.exports = router;