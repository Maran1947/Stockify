const router = require('express').Router();
const authController = require("../../controllers/authentication/authenticationController");

router.post('/signup', authController.signup_user);
router.post('/signin', authController.signin_user);
router.get('/get?', authController.get_trader_by_userId);
router.patch('/reset?', authController.reset_user_funds);

module.exports = router;