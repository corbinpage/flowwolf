var Flow = require(__base + 'models/flow.js');

var Session = function(flow, inputs) {
	this = flow.getSession();	
	this._id = null;
	this.flow = flow;
	this.inputs = [];
	this.outputs = [];
	this.rulesFired = [];

	this.setInputs(inputs);
};

Session.prototype.setInputs = function(inputs) { 
	var thisSession = this;
	var thisFlow = this.flow;
	var queryParams = _.keys(inputs);

	_.each(thisFlow.inputObjects, function(InputObject){
		if(inputs[InputObject.paramLabel]) {
			// console.log("Parameter: {" + InputObject.paramLabel + ": " + inputs[InputObject.paramLabel] + "}");
			var input = new InputObject(inputs[InputObject.paramLabel]);
			thisSession.inputs.push(input);
			thisSession.assert(input);
		}
	});
};

Session.prototype.getReturnValues = function() { 
	return {
		"_id": 			this._id,
		"inputs": 	this.inputs.map(function(input) { return input.getDisplay()}),
		"outputs": 	this.outputs.map(function(output) { return output.getDisplay()}),
		"rulesFired": this.rulesFired
	}
};

Session.prototype.run = function() {
	var session = this;
	var thisFlow = this.flow;


	console.log("-----Start-----");

	var promise = session.on("fire", function (ruleName) {
		session.rulesFired.push(ruleName);
	})
	.match();

	promise.then(function(){
		_.each(thisFlow.outputObjects, function (obj) {
			var output = session.getFacts(obj);
			if(output.length) {
				session.outputs = session.outputs.concat(session.getFacts(obj));				
			}
		});		

		console.log("Rules fired: ", thisFlow.rulesFired);
		session.dispose();
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

Session.prototype.dispose = function() {
	this.session.dispose();
	Flow.nools.deleteFlow(thisFlow.id);
};

module.exports = Session;