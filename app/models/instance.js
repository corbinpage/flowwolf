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

Instance.prototype.setOutputs = function(serviceFacts) {
	this.outputs = {};
	thisInstance = this;

	if(serviceFacts) {
		Object.keys(serviceFacts).forEach(function(k) {
			if(!thisInstance.inputs[k]) {
				thisInstance.outputs[k] = serviceFacts[k];
			}
		});
	}
};

Instance.prototype.run = function() {
	var thisInstance = this;
	var promise = this.service.run();

	promise.then(function(results){
		thisInstance.setOutputs(results.data);
		var run_id = thisInstance.saveRun(results.conditionRuns);
		thisInstance.run_id = run_id
		thisInstance.conditionRuns = results.conditionRuns;
	});

	return promise;
};

Instance.prototype.saveRun = function(conditionRuns) {
	var thisInstance = this;

	models.Run.create({
		decision_id: thisInstance.decision_id,
		// InputRuns: thisInstance.inputs,
		"outputs": JSON.stringify(thisInstance.outputs),
		"rulesFired": JSON.stringify(thisInstance.rulesFired)
	})
	.then(function(run) {
		run.id = run.null;

		var inputRuns = thisInstance.inputs.map(function(i) {
			i.run_id = run.id;
			return i;
		});

		models.InputRun.bulkCreate(inputRuns);

		conditionRuns = conditionRuns.map(function(c) {
			c.run_id = run.id;
			return c;
		});

		models.ConditionRun.bulkCreate(conditionRuns);

		return run.id;
	})
};

module.exports = Instance;