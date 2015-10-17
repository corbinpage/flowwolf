var Flow = {
	id: null,
	displayName: null,
	inputs: {},
	outputs: {},

	rulesFired: [],
	session: {},
	Result: {},

	findFlow: function(id) {
		this.id = id;
		this.displayName = id;
	},
	setInputs: function(inputs) { this.inputs = inputs; },
	setOutputs: function(outputs) { this.outputs = outputs; },
	getReturnValues: function() { 
		return {
			"id": 			this.id,
			"inputs": 	this.inputs,
			"outputs": 	this.outputs
		}
	},
	setSession: function() { 
		var nools = require('nools/index.js');
		var thisFlow = this;
		var decision;

		if(nools.hasFlow(this.id)) {
			decision = nools.getFlow(this.id);
		} else {
			decision = nools.compile(__dirname + "/" + this.id + ".nools", {
				scope: { logger: String }
			});
		}

		this.session = decision.getSession();		
		var Input = require("./structure.js");
		var inherits = require('util').inherits;

		Object.keys(thisFlow.inputs).forEach(function(key) {
			var val = thisFlow.inputs[key];
			console.log("{" + key + ":" + val + "}");
			
			var newInput = function(key, value) {
				this.key = key;
				this.value = value;
			}
			inherits(newInput, Input);
			thisFlow.session.assert(new newInput(key,val));
		});

		var Gender = decision.getDefined("Gender");
		var Country = decision.getDefined("Country");
		var Age = decision.getDefined("Age");
		this.Result = decision.getDefined("Result");
		this.session.assert(new Gender('M'));
		this.session.assert(new Country('Andorra'));
		this.session.assert(new Age(27));

	},
	run: function() {
		var thisflow = this;
		var session = thisflow.session;

		console.log("-----Start-----");
		console.log(session.getFacts());

		var promise = session.on("fire", function (ruleName) {
			thisflow.rulesFired.push(ruleName);
		})
		.match();

		promise.then(function(){
			console.log("Rules fired: ", thisflow.rulesFired);
			console.log(session.getFacts());
			thisflow.outputs = session.getFacts(thisflow.Result);
			session.dispose();
			console.log("-----Complete-----");
		},
		function(err){
			console.log("Rules fired: ", rulesFired);
			console.log(session.getFacts());    	
			console.error(err.stack);
			session.dispose();
			console.log("-----Error-----");
		});

		return promise;
	}

}

module.exports = Flow;