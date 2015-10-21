var Flow = {
	id: null,
	displayName: null,
	inputs: [],
	outputs: {},

	rulesFired: [],
	session: {},
	customClasses: {},

	findFlow: function(id) {
		this.id = id;
		this.displayName = id;
		this.loadClasses();
	},
	setInputs: function(inputs) { 
		var _ = require('underscore');
		var thisFlow = this;

		this.inputs = [];

		var queryParams = _.keys(inputs);

		var customClasses = _.values(thisFlow.customClasses);

		_.each(queryParams, function(param) {
			var val = inputs[param];

			_.each(customClasses, function(customClass){
				if(customClass.paramLabel() === param) {
					// console.log("{" + param + ":" + val + "}" + " - " + customClass.paramLabel());
					var input = new customClass(val);
					thisFlow.session.assert(input);
					thisFlow.inputs.push(input);

				}
			});			
		});
	},
	setOutputs: function(outputs) { this.outputs = outputs; },
	getReturnValues: function() { 
		return {
			"id": 			this.id,
			"inputs": 	this.inputs.map(function(input) { return input.getDisplaySummary()}),
			"outputs": 	this.outputs
		}
	},
	loadClasses: function() {
		if(this.id) {
			this.customClasses = require(__dirname + "/" + this.id + "Objects.js");
		}

		var Output = require(__dirname + "/bin/output.js");
		this.customClasses["Output"] = Output;
	},
	setSession: function() { 
		var nools = require('nools/index.js'),
		thisFlow = this,
		decision;

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

	},
	run: function() {
		var nools = require('nools/index.js');
		var thisFlow = this;
		var session = thisFlow.session;

		console.log("-----Start-----");
		// console.log(session.getFacts());

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
	}

}

module.exports = Flow;