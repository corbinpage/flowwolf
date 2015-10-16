var FlowController = {
	flowId: null,
	inputs: {},
	outputs: {},

	setFlowId: function(id) { this.flowId = id; },
	setInputs: function(inputs) { this.inputs = inputs; },

	getReturnValues: function() { 
		return {
			"id ": 			this.flowId,
			"inputs": 	this.inputs,
			"outputs": 	this.outputs
		}
	}

}

module.exports = FlowController;