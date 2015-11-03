var express = require('express');
var router = express.Router();
// var FlowController = require('../controllers/flowController');
var Flow = require(__base + 'lib/models/flow.js');
var Instance = require(__base + 'lib/models/instance.js');

/* GET flows */
router.get('/flows/:id', function(req, res, next) {
	var promise = Flow.findBySlug(req.params.id);

	console.log('promise: ' + promise);

	promise.then(function(doc){
		var flow = new Flow(doc);
		var instance = new Instance(flow, req.query);
		console.log('instance');

		instance.run().then(function(){
			var returnValues = instance.getReturnValues();

			if(Object.keys(returnValues).length) {
				res.jsonp(returnValues);
			} else {
				res.jsonp({"Success": "Success, but empty response"});
			}
		},
		function(err){
			res.jsonp({"Error": "An Error has occurred"});
		})

	},
	function(err){
		res.jsonp({"Error": "An Error has occurred"});
	});

});

module.exports = router;