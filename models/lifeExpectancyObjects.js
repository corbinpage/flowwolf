var Result = function() {
	this.value = null;
	this.displayValue = null;
	this.temp = [];
};

var Gender = function(value) {
	this.value = value;
	this.label = 'Gender';
};

var Country = function(value) {
	this.value = value;
	this.label = 'Country';
};

var Age = function(value) {
	this.value = value;
	this.label = 'Age';
};

Result.paramLabel = function () { return 'result';};
Gender.paramLabel = function () { return 'gender';};
Country.paramLabel = function () { return 'country';};
Age.paramLabel = function () { return 'age';};

module.exports = {
	Result: Result,
	Gender: Gender,
	Country: Country,
	Age: Age
};