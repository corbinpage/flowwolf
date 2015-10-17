var express = require('express');
var router = express.Router();

/* GET flows */
router.get('/flows/:id', function(req, res, next) {
	var FlowController = require('../controllers/flowController');
	FlowController.setFlow(req.params.id, req.query);

	FlowController.run().then(function(){
		var returnValues = FlowController.flow.getReturnValues();

		if(Object.keys(returnValues).length) {
			res.jsonp(returnValues);
		} else {
			res.jsonp({"Success": "Success, but empty response"});
		}
	},
	function(err){
		res.jsonp({"Error": "An Error has occurred"});
	});

});

module.exports = router;