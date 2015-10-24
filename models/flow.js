var Flow = function(id) {
	this.id = id;
	this.displayName = id;
	this.inputs = [];
	this.outputs = [];
	this.session = {};
	this.customClasses = {};
	this.rulesFired = [];

	this.loadCustomClasses();
};

Flow.prototype.loadCustomClasses = function() {
	var inherits = require("util").inherits;
	var Input = require(__dirname + "/bin/" + "input.js");
	var Output = require(__dirname + "/bin/" + "output.js");
	var customClassNames = require(__dirname + "/" + this.id + "Objects.js");

	var thisFlow = this;

	if(thisFlow.id) {
		_.each(customClassNames, function(className) {
			var newObject = function(value) {
				newObject.super_.call(this, className.toLowerCase(), value);
			};
			inherits(newObject, Input);
			newObject.paramLabel = className.toLowerCase();

			thisFlow.customClasses[className] = newObject;
		});
	}

	this.customClasses["Output"] = Output;
};

Flow.prototype.setInputs = function(inputs) { 
	var thisFlow = this;
	var queryParams = _.keys(inputs);
	var customClasses = _.values(thisFlow.customClasses);

	_.each(queryParams, function(param) {
		var val = inputs[param];

		_.each(customClasses, function(customClass){
			if(customClass.paramLabel === param) {
				// console.log("{" + param + ":" + val + "}" + " - " + customClass.paramLabel);
				var input = new customClass(val);
				thisFlow.session.assert(input);
				thisFlow.inputs.push(input);
			}
		});			
	});
};

Flow.prototype.setSession = function() { 
	var nools = require('nools/index.js');
	var decision;

	if(nools.hasFlow(this.id)) {
		decision = nools.getFlow(this.id);
	} else {
		decision = nools.compile(__dirname + "/" + this.id + ".nools", {
			scope: { 
				logger: String,
				temp: {}
			},
			define: this.customClasses
		});
	}

	this.session = decision.getSession();		

};

Flow.prototype.getReturnValues = function() { 
	return {
		"id": 			this.id,
		"inputs": 	this.inputs.map(function(input) { return input.getDisplay()}),
		// inputs: this.inputs,
		"outputs": 	this.outputs.map(function(output) { return output.getDisplay()})
	}
};

Flow.prototype.run = function() {
	var nools = require('nools/index.js');
	var thisFlow = this;
	var session = thisFlow.session;

	console.log("-----Start-----");

	var promise = session.on("fire", function (ruleName) {
		thisFlow.rulesFired.push(ruleName);
	})
	.match();

	promise.then(function(){
		console.log("Rules fired: ", thisFlow.rulesFired);
		thisFlow.outputs = session.getFacts(thisFlow.customClasses.Output);
		session.dispose();
		console.log("-----Complete-----");
	},
	function(err){
		console.log("Rules fired: ", rulesFired);
		console.log(session.getFacts());    	
		console.error(err.stack);
		session.dispose();
		nools.deleteFlow(thisFlow.id);
		console.log("-----Error-----");
	});

	return promise;
};

module.exports = Flow;