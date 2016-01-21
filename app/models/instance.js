var NoolsService = require(__base + 'app/services/noolsService');
var db = require(__base + 'app/db/db');

var Instance = function(decision, inputs) {
	this.decision_id = decision.id;
	this.setInputs(inputs);
	this.outputs = [];
	this.rulesFired = [];

	this.rulesService = "nools";

	if(this.rulesService === "nools") {
		this.service = new NoolsService(decision);
		this.service.setInputs(inputs);
	}
};

Instance.prototype.setInputs = function(inputs) {
	this.inputs = [];
	thisInstance = this;
	if(inputs) {
		Object.keys(inputs).forEach(function(k) {
			var obj = {};
			obj[k] = inputs[k];
			thisInstance.inputs.push(obj);
		});
	}
};

Instance.prototype.setOutputs = function() {
	this.outputs = this.service.getOutputs();
};

Instance.prototype.getReturnValues = function() { 
	return {
		"inputs": 	this.inputs,
		"outputs": 	this.outputs,
		"rulesFired": this.rulesFired
	}
};

Instance.prototype.run = function() {
	var thisInstance = this;
	var thisService = this.service;
	var thisSession = this.service.session;

	console.log("-----Start-----");

	var promise = this.service.session.on("fire", function (ruleName) {
		thisInstance.rulesFired.push(ruleName);
	})
	.match();

	promise.then(function(){
		thisInstance.setOutputs();
		thisInstance.dispose();
		console.log("Rules fired: ", thisInstance.rulesFired);
		console.log("-----Complete-----");
	},
	function(err){
		console.log("Rules fired: ", thisInstance.rulesFired);
		console.log(thisSession.getFacts());    	
		console.error(err.stack);
		thisInstance.dispose();
		console.log("-----Error-----");
	});

	return promise;
};

Instance.prototype.dispose = function() {
	if(this.rulesService === "nools") {
		this.service.dispose();
	}
};

module.exports = Instance;