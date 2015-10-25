var FlowSchema = require("../db/schema/flowSchema.js");
var db = require("../db/db.js");

var FlowDB = function(id) {
	this.id = id;
	this.title = id;
	this.inputs = [];
	this.outputs = [];

	this.rules = null;
	this.rulesFired = [];
	this.inputObjects = [];
	this.outputObjects = [];
	this.session = {};

	if(this.id) {
		this.loadFlow();		
	}
};
Flow.nools = require('nools/index.js');

Flow.prototype.objectDefinitions = function() {
	var customObjects = {};

	_.each(this.inputObjects,function(obj) {
		customObjects[obj.className] = obj; 
	})

	_.each(this.outputObjects,function(obj) {
		customObjects[obj.className] = obj; 
	})

	return customObjects;
};

Flow.prototype.loadCustomObjects = function() {
	var inherits = require("util").inherits;
	var Input = require(__dirname + "/bin/" + "input.js");
	var Output = require(__dirname + "/bin/" + "output.js");
	var customObjects = require(__dirname + "/" + this.id + "Objects.js");
	var thisFlow = this;

	_.each(customObjects.inputs, function(className) {
		var newObject = function(value) {
			newObject.super_.call(this, className.toLowerCase(), value);
		};
		inherits(newObject, Input);
		newObject.className = className;
		newObject.paramLabel = className.toLowerCase();

		thisFlow.inputObjects.push(newObject);
	});

	_.each(customObjects.outputs, function(className) {
		var newObject = function(id) {
			newObject.super_.call(this, id);
		};
		inherits(newObject, Output);
		newObject.className = className;

		thisFlow.outputObjects.push(newObject);
	});

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
			define: this.objectDefinitions()
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

	_.each(thisFlow.inputObjects, function(InputObject){
		if(inputs[InputObject.paramLabel]) {
			// console.log("Parameter: {" + InputObject.paramLabel + ": " + inputs[InputObject.paramLabel] + "}");
			var input = new InputObject(inputs[InputObject.paramLabel]);
			thisFlow.inputs.push(input);
			thisFlow.session.assert(input);
		}
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
		_.each(thisFlow.outputObjects, function (obj) {
			var output = session.getFacts(obj);
			if(output.length) {
				thisFlow.outputs = thisFlow.outputs.concat(session.getFacts(obj));				
			}
		});		

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