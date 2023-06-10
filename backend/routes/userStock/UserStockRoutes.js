const router = require('express').Router();
const userStocksController = require("../../controllers/buyStock/BuyStockController");
const exitStockController = require("../../controllers/buyStock/ExitStockController");

router.post('/buy', userStocksController.buy_stock);
router.post('/sell', userStocksController.sell_stock);
router.post('/exit/buy', exitStockController.exit_buy_stock);
router.post('/exit/sell', exitStockController.exit_sell_stock);

module.exports = router;