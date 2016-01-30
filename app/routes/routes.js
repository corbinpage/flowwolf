var express = require('express');
var router = express.Router();
var Instance = require(__base + 'app/models/instance');
var models = require(__base + 'app/models/index');

/* GET decision */
router.get('/decision/:slug', function(req, res, next) {
	models.Decision.findOne({
		where: {slug: req.params.slug},
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

			promise
			.then(function(run_id){
				models.Run.findOne({
					where: {id: run_id},
					include: [models.InputRun, models.ConditionRun]
				})
				.then(function(run) {

					console.log(run.ConditionRuns);

					res.render('run/show', {
						decision: decision,
						run: run,
						layout: 'layout/default'
					});
				})
			})
			.fail(function(err){
				var err = new Error('Unable to run Decision.');
				err.status = 404;
				next(err);
			})
		}
	},
	function(err){
		var err = new Error('Database unavailable.');
		err.status = 404;
		next(err);
	});

});

module.exports = router;