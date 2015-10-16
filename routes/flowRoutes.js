var express = require('express');
var router = express.Router();

/* GET flows */
router.get('/flows/:id', function(req, res, next) {
	var FlowController = require('../controllers/flowController');
	FlowController.setFlow(req.params.id);
	FlowController.setInputs(req.query);

	res.jsonp(FlowController.getReturnValues());
});

module.exports = router;