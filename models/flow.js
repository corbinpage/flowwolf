var Flow = {
	id: null,
	inputs: {},
	outputs: {},

	setId: function(id) { this.id = id; },
	setInputs: function(inputs) { this.inputs = inputs; },
	setOutputs: function(outputs) { this.outputs = outputs; },
	run: function() {
		var nools = require("node_modules/nools/index.js");
		var decision;

		if(nools.hasFlow("lifeExpectancy")) {
			decision = nools.getFlow("lifeExpectancy");
		} else {
			decision = nools.compile(__dirname + "/lifeExpectancy.nools", {
				scope: { logger: String }
			});
		}
		var rulesFired = [];
		var Gender = decision.getDefined("Gender");
		var Country = decision.getDefined("Country");
		var Age = decision.getDefined("Age");
		var Result = decision.getDefined("Result");
		var session = decision.getSession(new Gender('M'), new Country('Andorra'), new Age(27));

		console.log("-----Start-----");
		console.log(session.getFacts());

		session.on("fire", function (ruleName) {
			rulesFired.push(ruleName);
		})
		.match(function(err){
			if(err){
				console.log("Rules fired: ", rulesFired);
				console.log(session.getFacts());    	
				console.error(err.stack);
				console.log("-----Error-----");
			} 
			else{
				console.log("Rules fired: ", rulesFired);
				console.log(session.getFacts());
				var results = session.getFacts(Result);
				// this.outputs = results;
				this.outputs = {"output1": 1, "output2": "A"};
				session.dispose();
				console.log("-----Complete-----");
			}
		})

	}

}

module.exports = Flow;