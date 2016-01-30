var NoolsService = require(__base + 'app/services/noolsService');
var nodeRulesService = require(__base + 'app/services/nodeRulesService');
var models = require(__base + 'app/models/index');


var Instance = function(decision, inputs) {
	this.decision_id = decision.id;
	this.decision = decision;
	this.service = new nodeRulesService(decision);

	this.setInputs(inputs);
	this.outputs = {};
};

Instance.prototype.setInputs = function(inputs) {
	this.inputs = [];
	thisInstance = this;
	this.service.setInputs(inputs);

	if(!_.isEmpty(inputs)) {
		var inputParams = [];
		inputParams = this.decision.Inputs.map(function(i) {
			return i.name;
		})
		inputParamIds = this.decision.Inputs.map(function(i) {
			return i.id;
		})

		Object.keys(inputs).forEach(function(i) {
			var recognized = inputParams.indexOf(i) !== -1;
			var input_id = recognized ? inputParamIds[inputParams.indexOf(i)] : null

			thisInstance.inputs.push({
				param: i,
				value: inputs[i],
				recognized: recognized,
				input_id: input_id
			});
		});
	}
};

Instance.prototype.run = function() {
	var thisInstance = this;

	var promise = this.service.run()
	.then(this.saveRun)

	return promise;
};

Instance.prototype.saveRun = function(results) {
	var thisInstance = this.thisInstance;
	var run_id;
	var inputRuns = [];
	var conditionRuns = [];

	var promise = models.Run.create({
		decision_id: thisInstance.decision_id,
		"outputs": JSON.stringify(results.data),
		"rulesFired": JSON.stringify(thisInstance.rulesFired)
	})
	.then(function(run) {
		run_id = run.null;

		inputRuns = thisInstance.inputs.map(function(i) {
			i.run_id = run_id;
			return i;
		});

		conditionRuns = results.conditionRuns.map(function(c) {
			c.run_id = run_id;
			return c;
		});
	})
	.then(function() {
		return models.InputRun.bulkCreate(inputRuns);
	})
	.then(function() {
		return models.ConditionRun.bulkCreate(conditionRuns);
	})
	.then(function() {
		return run_id;
	});

	return promise;
};

module.exports = Instance;