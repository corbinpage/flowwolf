var Output = function() {
	this.id = null;
	this.value = null;
	this.label = null;
};

Output.prototype.getDisplay = function() {
	var display = {};
	display["id"] = this.id;
	display["value"] = this.value;
	return display;
};

Output.paramLabel = function () { return 'output';};

module.exports = Output;