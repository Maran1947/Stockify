const router = require('express').Router();
const orderController = require("../../controllers/orders/OrdersControlller");

router.get('/all?', orderController.get_user_orders);

module.exports = router;