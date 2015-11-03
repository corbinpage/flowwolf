var Flow = require(__base + 'lib/models/flow.js');

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
	var queryParams = _.keys(inputs);

	_.each(thisFlow.inputObjects, function(InputObject){
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
		"inputs": 	this.inputs.map(function(input) { return input.getDisplay()}),
		"outputs": 	this.outputs.map(function(output) { return output.getDisplay()}),
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
		_.each(thisFlow.outputObjects, function (obj) {
			var output = thisSession.getFacts(obj);
			if(output.length) {
				thisInstance.outputs = thisInstance.outputs.concat(thisSession.getFacts(obj));				
			}
		});		

		console.log("Rules fired: ", thisFlow.rulesFired);
		thisSession.dispose();
		console.log("-----Complete-----");
	},
	function(err){
		console.log("Rules fired: ", rulesFired);
		console.log(thisSession.getFacts());    	
		console.error(err.stack);
		thisFlow.dispose();
		console.log("-----Error-----");
	});

	return promise;
};

Instance.prototype.dispose = function() {
	this.session.dispose();
	Flow.nools.deleteFlow(thisFlow.id);
};

module.exports = Instance;