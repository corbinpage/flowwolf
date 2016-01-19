var express = require('express');
var router = express.Router();
// var FlowController = require('../controllers/flowController');
var Flow = require(__base + 'app/models/flow');
var Instance = require(__base + 'app/models/instance');
var models = require(__base + 'app/models/persistent/index');

/* GET flows */
router.get('/flows/:id', function(req, res, next) {
	models.Rule.findOne({
		where: {slug: req.params.id},
		include: [models.Input, models.Output]
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