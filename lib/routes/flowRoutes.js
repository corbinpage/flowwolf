var express = require('express');
var router = express.Router();
// var FlowController = require('../controllers/flowController');
var Flow = require(__base + 'lib/models/flow.js');
var Instance = require(__base + 'lib/models/instance.js');
var models = require(__base + 'db/models.js');

var Rule = models.Rule;
var Input = models.Input;
var Output = models.Output;

/* GET flows */
router.get('/flows/:id', function(req, res, next) {
	Rule.findOne({
		where: {slug: req.params.id},
		include: [Input, Output]
	}).then(function(rule) {
		var flow = new Flow(rule);
		var instance = new Instance(flow, req.query);

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