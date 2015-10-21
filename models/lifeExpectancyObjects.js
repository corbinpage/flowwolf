var Input = require(__dirname + "/bin/" + "input.js")

var Gender = function(value) {
	this.prototype = Object.create(Input.prototype);
	Input.call(this, 'gender', value);
};
Gender.paramLabel = function () { return 'gender';};

var Country = function(value) {
	this.prototype = Object.create(Input.prototype);
	Input.call(this, 'country', value);
};
Country.paramLabel = function () { return 'country';};

var Age = function(value) {
	this.prototype = Object.create(Input.prototype);
	Input.call(this, 'age', value);
};
Age.paramLabel = function () { return 'age';};

module.exports = {
	Gender: Gender,
	Country: Country,
	Age: Age
};