var Output = function(id) {
	this.id = id ? id : "unassigned";
	this.value = null;
	this.label = null;
};
Output.type = 'output';

Output.prototype.type = 'output';

Output.prototype.getDisplay = function() {
	var display = {};
	display[this.id] = this.value;
	return display;
};

Output.prototype.set = function(value, id) {
	this.id = id ? id : this.id;
	this.value = value;
};

module.exports = Output;