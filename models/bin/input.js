var Input = function(id, value) {
	this.id = id;
	this.value = value;
	this.label =  id;
};
Input.paramLabel = 'input';

Input.prototype.getDisplay = function() {
	var display = {};
	display[this.id] = this.value;
	return display;
};

module.exports = Input;