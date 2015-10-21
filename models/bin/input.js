String.prototype.capitalize = function(){
	return this.toLowerCase().replace( /\b\w/g, function (m) {
		return m.toUpperCase();
	});
};

var Input = function(id, value) {
	this.id = id;
	this.value = value;
	this.label = id.capitalize();

	this.getDisplay = function() {
		var display = {};
		display[this.id] = this.value;
		return display;
	};

};

module.exports = Input;