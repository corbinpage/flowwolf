var express = require('express');
var router = express.Router();
var Instance = require(__base + 'app/models/instance');
var models = require(__base + 'app/models/index');

/* GET flows */
router.get('/flows/:id', function(req, res, next) {
	models.Decision.findOne({
		where: {slug: req.params.id},
		include: [models.Input, models.Output]
	}).then(function(decision) {
		var instance = new Instance(decision, req.query);

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