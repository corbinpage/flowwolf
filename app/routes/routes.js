var express = require('express');
var router = express.Router();
var Instance = require(__base + 'app/models/instance');
var models = require(__base + 'app/models/index');

/* GET decision */
router.get('/decision/:decision_slug', function(req, res, next) {
	models.Decision.findOne({
		where: {slug: req.params.decision_slug},
		include: [models.Input, models.Output, 
		{
			model: models.Rule,
			include: [models.Condition, models.Action]
		}
		]
	}).then(function(decision) {
		if(!decision) {
			var err = new Error('Decision not found.');
			err.status = 404;
			next(err);
		} else {
			var instance = new Instance(decision, req.query);
			var promise = instance.run();

			promise.then(function(results){

				console.log(instance);

				res.render('show', {
					decision: decision,
					results: results
				});
			})
			.catch(function(err){
				var err = new Error('Unable to run Decision.');
				err.status = 404;
				next(err);
			});
		}
	},
	function(err){
		var err = new Error('Database call error.');
		err.status = 404;
		next(err);
	});

});

module.exports = router;