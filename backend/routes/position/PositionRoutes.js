const router = require('express').Router();
const positioncriptController = require("../../controllers/position/positionController");

router.get('/all?', positioncriptController.get_positions_by_userId);


module.exports = router;