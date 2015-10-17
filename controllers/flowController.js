var Flow = require("../models/flow.js");

var FlowController = {
	flow: Flow,

	setFlow: function(id) { this.flow.setId(id); },
	setInputs: function(inputs) { this.flow.setInputs(inputs); },
	run: function() { return this.flow.run(); }

}

module.exports = FlowController;