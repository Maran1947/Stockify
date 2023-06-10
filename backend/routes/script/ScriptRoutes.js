const router = require('express').Router();
const scriptController = require("../../controllers/script/scriptController");

router.post('/add', scriptController.add_script);
router.get('/all', scriptController.get_all_script);
router.get('/search?', scriptController.search_script);
router.delete('/delete', scriptController.delete_scrips);
router.put('/update', scriptController.update_scrips);

module.exports = router;