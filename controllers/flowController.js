var Flow = require("../models/flow.js");

var FlowController = function(id, inputs) {
	this.flow = Flow;
	this.flow.findFlow(id);
	this.flow.setSession();
	this.flow.setInputs(inputs);
}

module.exports = FlowController;