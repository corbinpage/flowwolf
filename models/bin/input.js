var Input = function(id, value) {
	this.id = id;
	this.value = value;
	this.label =  id;
	this.className = 'Input';
};
Input.type = 'input';

Input.prototype.type = 'input';

Input.prototype.getDisplay = function() {
	var display = {};
	display[this.id] = this.value;
	return display;
};

module.exports = Input;