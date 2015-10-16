var Flow = require("../models/flow.js");

var FlowController = {
	flow: Flow,

	setFlow: function(id) { this.flow.setId(id); },
	setInputs: function(inputs) { this.flow.setInputs(inputs); },

	getReturnValues: function() { 
		this.flow.setOutputs("asdddf");
		this.flow.run();
		console.log("value");

		return {
			"id": 			this.flow.id,
			"inputs": 	this.flow.inputs,
			"outputs": 	this.flow.outputs
		}
	}

}

module.exports = FlowController;