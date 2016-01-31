var express = require('express');
var router = express.Router();
var Instance = require(__base + 'app/models/instance');
var models = require(__base + 'app/models/index');

/* Home */
router.get('/', function(req, res) {
	res.redirect('/decision');
});

/* INDEX Decisions */
router.get('/decision', function(req, res, next) {
	models.Decision.findAll({
		order: ['id']
	})
	.then(function(decisions) {
		res.render('decision', {
			decisions: decisions,
			layout: 'layout/default'
		});

	})
});

/* SHOW Decision */
router.get('/decision/:slug', function(req, res, next) {
	models.Decision.findOne({
		where: {slug: req.params.slug},
		include: [models.Input, models.Output, 
		{
			model: models.Rule,
			include: [models.Condition, models.Action]
		}],
		order: ['Rules.order']
	})
	.then(function(decision) {
		res.render('decision/show', {
			decision: decision,
			layout: 'layout/default'
		});

	})
});

/* GET decision run */
router.get('/decision/:slug/run', function(req, res, next) {
	models.Decision.findOne({
		where: {slug: req.params.slug},
		include: [models.Input, models.Output, 
		{
			model: models.Rule,
			include: [models.Condition, models.Action]
		}]
	})
	.then(function(decision) {
		if(!decision) {
			var err = new Error('Decision not found.');
			err.status = 404;
			next(err);
		} else {
			var instance = new Instance(decision, req.query);
			instance.run()
			.then(function(run_id){
				res.redirect('/decision/' + decision.slug + '/run/' + run_id);
			})
			.catch(function(err){
				var err = new Error('Unable to run Decision.');
				err.status = 404;
				next(err);
			})
		}
	},
	function(err){
		throwError(err);
	});

});

/* GET run */
router.get('/decision/:slug/run/:id', function(req, res, next) {
	models.Run.findOne({
		where: {id: req.params.id},
		include: [models.Decision, models.InputRun, 
		{
			model: models.ConditionRun,
			include: [models.Rule]
		}],
		order: ['ConditionRuns.id']
	})
	.then(function(run) {
		res.render('run/show', {
			decision: run.Decision,
			run: run,
			layout: 'layout/default'
		});
	})
	.catch(function(err){
		var err = new Error('Unable find decision run.');
		err.status = 404;
		throwError(err);
	})

});

/* SHOW Rule */
router.get('/decision/:slug/rules', function(req, res, next) {
	models.Decision.findOne({
		where: {slug: req.params.slug},
		include: [models.Input, models.Output, 
		{
			model: models.Rule,
			include: [models.Condition, models.Action]
		}],
		order: ['Rules.order']
	})
	.then(function(decision) {
		res.render('rule', {
			decision: decision,
			layout: 'layout/default'
		});

	})
});

function throwError(err) {
	err.status = err.status ? err.status : 404;
	err.message = err.message ? err.message : 'Unknown Error';
	next(err);
}

module.exports = router;