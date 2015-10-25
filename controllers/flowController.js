var Flow = require("../models/flow.js");

var FlowController = function(id, inputs) {
	this.flow = new Flow(id);
	this.flow.loadSession(inputs);
}

module.exports = FlowController;