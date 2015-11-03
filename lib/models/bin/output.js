var Output = function(className) {
	this.id = className.toLowerCase();
	this.value = null;
	this.label = className;
};
Output.prototype.type = 'output';

Output.prototype.getDisplay = function() {
	var display = {};
	display[this.id] = this.value;
	return display;
};

module.exports = Output;