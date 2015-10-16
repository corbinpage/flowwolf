var Flow = {
	id: null,
	inputs: {},
	outputs: {},

	setId: function(id) { this.id = id; },
	setInputs: function(inputs) { this.inputs = inputs; },
	setOutputs: function(outputs) { this.outputs = outputs; },
	run: function() {
		this.outputs = {"output1": 1, "output2": "A"};
	}

}

module.exports = Flow;