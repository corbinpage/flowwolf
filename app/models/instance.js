var NoolsService = require(__base + 'app/services/noolsService');
var db = require(__base + 'app/db/db');

var Instance = function(decision, inputs) {
	this.decision_id = decision.id;
	this.rulesService = "nools";
	this.rulesFired = [];

	if(this.rulesService === "nools") {
		this.flow = new NoolsService(decision);
		this.session = this.flow.getSession();
		this.inputs = [];
		this.outputs = [];
		this.setInputs(inputs);
	}
};

Instance.prototype.setInputs = function(inputs) { 
	var thisInstance = this;
	var thisSession = this.session;
	var thisFlow = this.flow;

	thisFlow.inputObjects.forEach(function(InputObject){
		if(inputs[InputObject.paramLabel]) {
			// console.log("Parameter: {" + InputObject.paramLabel + ": " + inputs[InputObject.paramLabel] + "}");
			var input = new InputObject(inputs[InputObject.paramLabel]);
			thisInstance.inputs.push(input);
			thisSession.assert(input);
		}
	});
};

Instance.prototype.getReturnValues = function() { 
	return {
		"inputs": 	this.inputs.map(function(i) { return i.getDisplay()}),
		"outputs": 	this.outputs.map(function(o) { return o.getDisplay()}),
		"rulesFired": this.rulesFired
	}
};

Instance.prototype.run = function() {
	var thisInstance = this;
	var thisSession = this.session;
	var thisFlow = this.flow;

	console.log("-----Start-----");

	var promise = this.session.on("fire", function (ruleName) {
		thisInstance.rulesFired.push(ruleName);
	})
	.match();

	promise.then(function(){
		console.log(thisSession.getFacts());
		thisFlow.outputObjects.forEach(function (obj) {
			var output = thisSession.getFacts(obj);
			if(output.length) {
				thisInstance.outputs = thisInstance.outputs.concat(thisSession.getFacts(obj));				
			}
		});		

		console.log("Rules fired: ", thisInstance.rulesFired);
		thisInstance.dispose();
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
	this.session.dispose();
	this.flow.dispose();
};

module.exports = Instance;