String.prototype.capitalize = function(){
	return this.toLowerCase().replace( /\b\w/g, function (m) {
		return m.toUpperCase();
	});
};

var Input = function(id, value) {
	this.id = id;
	this.value = value;
	this.label = id.capitalize();

	this.getDisplaySummary = function() {
		return {
			id: this.id,
			value: this.value
		};
	};

};

module.exports = Input;