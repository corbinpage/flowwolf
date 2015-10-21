var Flow = {
	id: null,
	displayName: null,
	inputs: {},
	outputs: {},

	rulesFired: [],
	session: {},
	customClasses: {},
	inputClasses: {},

	findFlow: function(id) {
		this.id = id;
		this.displayName = id;
		this.loadClasses();
	},
	setInputs: function(inputs) { 
		var _ = require('underscore');
		this.inputs = inputs;
		var thisFlow = this;

		var queryParams = _.keys(inputs);

		var customClasses = _.values(thisFlow.customClasses);

		_.each(queryParams, function(param) {
			var val = thisFlow.inputs[param];

			_.each(customClasses, function(customClass){
				if(customClass.paramLabel() === param) {
					// console.log("{" + param + ":" + val + "}" + " - " + customClass.paramLabel());
					thisFlow.session.assert(new customClass(val));
				}
			});			
		});
	},
	setOutputs: function(outputs) { this.outputs = outputs; },
	getReturnValues: function() { 
		return {
			"id": 			this.id,
			"inputs": 	this.inputs,
			"outputs": 	this.outputs
		}
	},
	loadClasses: function() {
		if(this.id) {
			this.customClasses = require(__dirname + "/" + this.id + "Objects.js");
		}
	},
	setSession: function() { 
		var nools = require('nools/index.js'),
		thisFlow = this,
		decision;

		if(nools.hasFlow(this.id)) {
			decision = nools.getFlow(this.id);
		} else {
			decision = nools.compile(__dirname + "/" + this.id + ".nools", {
				scope: { logger: String},
				define: this.customClasses
			});
		}

		this.session = decision.getSession();		

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
			// console.log(session.getFacts()[0].getName());
			thisflow.outputs = session.getFacts(thisflow.customClasses.Result);
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