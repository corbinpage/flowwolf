var Flow = function(id) {
	this.id = id;
	this.displayName = id;
	this.inputs = [];
	this.outputs = [];
	this.session = {};
	this.customObjects = {};
	this.rulesFired = [];
	this.rules = null;

	this.loadFlow();
};
Flow.nools = require('nools/index.js');

Flow.prototype.loadCustomObjects = function() {
	var inherits = require("util").inherits;
	var Input = require(__dirname + "/bin/" + "input.js");
	var Output = require(__dirname + "/bin/" + "output.js");
	var CustomObjectNames = require(__dirname + "/" + this.id + "Objects.js");

	var thisFlow = this;

	if(thisFlow.id) {
		_.each(CustomObjectNames, function(className) {
			var newObject = function(value) {
				newObject.super_.call(this, className.toLowerCase(), value);
			};
			inherits(newObject, Input);
			newObject.paramLabel = className.toLowerCase();

			thisFlow.customObjects[className] = newObject;
		});
	}

	this.customObjects["Output"] = Output;
};

Flow.prototype.loadRules = function() {
	var fs = require("fs");
	var noolsFilePath = __dirname + "/" + this.id + ".nools";

	this.rules = fs.readFileSync(noolsFilePath, 'utf8');
};

Flow.prototype.loadFlow = function() {
	this.loadCustomObjects();
	this.loadRules();
};

Flow.prototype.loadSession = function(optionalInput) {
	var decision;

	if(Flow.nools.hasFlow(this.id)) {
		decision = Flow.nools.getFlow(this.id);
	} else {
		decision = Flow.nools.compile(this.rules, {
			name: this.id,
			scope: { 
				logger: String,
				temp: {}
			},
			define: this.customObjects
		});
	}

	this.session = decision.getSession();	

	if (optionalInput) {
		this.setInputs(optionalInput);
	}

};

Flow.prototype.setInputs = function(inputs) { 
	var thisFlow = this;
	var queryParams = _.keys(inputs);
	var CustomObjects = _.values(thisFlow.customObjects);

	_.each(queryParams, function(param) {
		var val = inputs[param];

		_.each(CustomObjects, function(CustomObject){
			if(CustomObject.paramLabel === param) {
				console.log("{" + param + ":" + val + "}" + " - " + CustomObject.paramLabel);
				var input = new CustomObject(val);
				thisFlow.session.assert(input);
				thisFlow.inputs.push(input);
			}
		});			
	});
};

Flow.prototype.getReturnValues = function() { 
	return {
		"id": 			this.id,
		"inputs": 	this.inputs.map(function(input) { return input.getDisplay()}),
		"outputs": 	this.outputs.map(function(output) { return output.getDisplay()}),
		"rulesFired": this.rulesFired
	}
};

Flow.prototype.run = function() {
	var thisFlow = this;
	var session = thisFlow.session;

	console.log("-----Start-----");

	var promise = session.on("fire", function (ruleName) {
		thisFlow.rulesFired.push(ruleName);
	})
	.match();

	promise.then(function(){
		thisFlow.outputs = session.getFacts(thisFlow.customObjects.Output);
		console.log("Rules fired: ", thisFlow.rulesFired);
		thisFlow.dispose();
		console.log("-----Complete-----");
	},
	function(err){
		console.log("Rules fired: ", rulesFired);
		console.log(session.getFacts());    	
		console.error(err.stack);
		thisFlow.dispose();
		console.log("-----Error-----");
	});

	return promise;
};

Flow.prototype.dispose = function() {
	this.session.dispose();
	Flow.nools.deleteFlow(this.id);
};

module.exports = Flow;