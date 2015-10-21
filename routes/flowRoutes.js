var express = require('express');
var router = express.Router();
var FlowController = require('../controllers/flowController');

/* GET flows */
router.get('/flows/:id', function(req, res, next) {
	var flowController = new FlowController(req.params.id, req.query);

	flowController.flow.run().then(function(){
		var returnValues = flowController.flow.getReturnValues();

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