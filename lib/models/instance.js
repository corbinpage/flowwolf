var Flow = require(__base + 'lib/models/flow.js');
var db = require(__base + 'db/db.js');
var models = require(__base + 'db/models.js');

var Rule = models.Rule;
var Input = models.Input;
var Output = models.Output;
var Condition = models.Condition;
var Assignment = models.Assignment;


var Instance = function(flow, inputs) {
	this._id = null;
	this.inputs = [];
	this.outputs = [];
	this.rulesFired = [];
	this.flow = flow;
	this.session = flow.getSession();	
	this.setInputs(inputs);
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
		"_id": 			this._id,
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
		_.each(thisFlow.outputObjects, function (obj) {
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