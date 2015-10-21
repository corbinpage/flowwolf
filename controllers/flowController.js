var Flow = require("../models/flow.js");

var FlowController = {
	flow: Flow,

	setFlow: function(id, inputs) {
		this.flow.findFlow(id);
		this.flow.setSession();
		this.flow.setInputs(inputs);

	},
	run: function() { return this.flow.run(); }

}

module.exports = FlowController;