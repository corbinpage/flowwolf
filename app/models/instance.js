var NoolsService = require(__base + 'app/services/noolsService');
var nodeRulesService = require(__base + 'app/services/nodeRulesService');
var models = require(__base + 'app/models/index');


var Instance = function(decision, inputs) {
	this.decision_id = decision.id;
	this.rulesService = decision.service;
	this.inputs = inputs;
	this.outputs = {};
	this.rulesFired = [];

	var chosenService = (this.rulesService === "nools") ? NoolsService : nodeRulesService; 
	this.service = new chosenService(decision);
	this.service.setInputs(inputs);
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

Instance.prototype.display = function() { 
	return {
		"inputs": 	this.inputs,
		"outputs": 	this.outputs,
		"rulesFired": this.rulesFired
	}
};

Instance.prototype.run = function() {
	var thisInstance = this;
	var promise;

	if(this.rulesService === "nools") {
		var thisService = this.service;
		var thisSession = this.service.session;

		promise = this.service.session.on("fire", function (ruleName) {
			thisInstance.rulesFired.push(ruleName);
		})
		.match();

		promise.then(function(){
			thisInstance.setOutputs();
			thisInstance.dispose();
			models.Run.create({
				"decision_id": thisInstance.decision_id,
				"inputs": JSON.stringify(thisInstance.inputs),
				"outputs": JSON.stringify(thisInstance.outputs),
				"rulesFired": JSON.stringify(thisInstance.rulesFired)
			});
			console.log("Rules fired: ", thisInstance.rulesFired);
		},
		function(err){
			console.log("-----Error-----");
			console.log("Rules fired: ", thisInstance.rulesFired);
			console.log(thisSession.getFacts());    	
			console.error(err.stack);
			thisInstance.dispose();
		});
	} else {
		promise = this.service.run();
		promise.then(function(data){
      console.log("here");
      console.log(data);
			thisInstance.setOutputs(data);
			// thisInstance.dispose();
			models.Run.create({
				"decision_id": thisInstance.decision_id,
				"inputs": JSON.stringify(thisInstance.inputs),
				"outputs": JSON.stringify(thisInstance.outputs),
				"rulesFired": JSON.stringify(thisInstance.rulesFired)
			});
			// console.log("Rules fired: ", thisInstance.rulesFired);
		});
	}


	return promise;
};

Instance.prototype.dispose = function() {
	if(this.rulesService === "nools") {
		this.service.dispose();
	}
};

module.exports = Instance;