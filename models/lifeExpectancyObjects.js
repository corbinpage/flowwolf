var inherits = require('util').inherits;

String.prototype.capitalize = function(){
	return this.toLowerCase().replace( /\b\w/g, function (m) {
		return m.toUpperCase();
	});
};

var Input = function(id, value) {
	this.id = id;
	this.label = id.capitalize();
	this.value = value;
	this.className = this.label;
};
Input.paramLabel = function () { return this.id;};

Input.prototype.getName = function(){
	return this.className;
}

var Result = function() {
	this.value = null;
	this.displayValue = null;
	this.temp = [];
};
Result.paramLabel = function () { return 'result';};

var Gender = function(value) {
	Input.call(this, 'gender', value);
};
Gender.prototype = Object.create(Input.prototype);
Gender.prototype.constructor = Input;
Gender.paramLabel = function () { return 'gender';};

var Country = function(value) {
	Input.call(this, 'country', value);
};
Country.prototype = Object.create(Input.prototype);
Country.prototype.constructor = Input;
Age.paramLabel = function () { return 'country';};

var Age = function(value) {
	Input.call(this, 'age', value);
};
Age.prototype = Object.create(Input.prototype);
Age.prototype.constructor = Input;
Age.paramLabel = function () { return 'age';};

module.exports = {
	Input: Input,
	Result: Result,
	Gender: Gender,
	Country: Country,
	Age: Age
};