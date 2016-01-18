var Sequelize = require("sequelize");
var db = require('./db');
var models = require('./models');

var Rule = models.Rule;
var Input = models.Input;
var Output = models.Output;
var Condition = models.Condition;
var Assignment = models.Assignment;


// Life Expectancy Rules

Rule.create({
	"id": 1,
	"name": "Life Expectancy",
	"slug": "lifeExpectancy",
	"nools": `
define Result {
	value: null,
	displayValue: null,
	temp: []
}

define Gender {
	value : null,

	constructor: function(value){
		this.value = value;
	}
}

define Country {
	value : null,

	constructor: function(value){
		this.value = value;
	}
}

define Age {
	value : null,

	constructor: function(value){
		this.value = value;
	}
}

function returnDeathAge(gender, country) {
	var countryList = ["Japan","Spain","Andorra","Australia","Switzerland","Italy","Singapore","San Marino","Canada","Cyprus","France","Iceland","Israel","Luxembourg","Monaco","New Zealand","Norway","Sweden","Republic of Korea","Finland","Portugal","Ireland","Malta","Netherlands","United Kingdom","Austria","Germany","Greece","Belgium","Chile","Slovenia","Denmark","Lebanon","Colombia","Nauru","Costa Rica","Cuba","United States","Qatar","Barbados","Czech Republic","Croatia","Kuwait","Poland","Uruguay","Estonia","Bosnia and Herzegovina","Suriname","Panama","Peru","Bahrain","Brunei Darussalam","Dominican Republic","Maldives","Slovakia","Venezuela","Vietnam","Argentina","Mexico","United Arab Emirates","Oman","Saudi Arabia","Tunisia","Cook Islands","Montenegro","Macedonia","Hungary","Saint Lucia","Thailand","Ecuador","Bahamas","Belize","Paraguay","Turkey","Sri Lanka","China","Antigua and Barbuda","Libya","Dominica","Serbia","Lithuania","Latvia","Niue","Bulgaria","Cabo Verde","Romania","Saint Kitts and Nevis","Georgia","Mauritius","Seychelles","Honduras","Jamaica","Brazil","Iran","Malaysia","Saint Vincent and the Grenadines","Albania","Jordan","Samoa","Grenada","Nicaragua","Palau","Belarus","El Salvador","Cambodia","Azerbaijan","Guatemala","Vanuatu","Algeria","Ukraine","Armenia","Republic of Moldova","Egypt","Indonesia","Morocco","Tonga","Trinidad and Tobago","Iraq","Democratic People's Republic of Korea","Marshall Islands","Bangladesh","Russian Federation","Fiji","Kyrgyzstan","Uzbekistan","Philippines","Micronesia","Solomon Islands","Syrian Arab Republic","Kazakhstan","Tuvalu","Bolivia","Bhutan","Nepal","Tajikistan","Mongolia","Sao Tome and Principe","Namibia","Kiribati","Timor-Leste","India","Myanmar","Lao People's Democratic Republic","Pakistan","Rwanda","Senegal","Ethiopia","Madagascar","Yemen","Guyana","Turkmenistan","Eritrea","Mauritania","Sudan","Gabon","Papua New Guinea","Ghana","Haiti","Botswana","Comoros","Liberia","Djibouti","Gambia","United Republic of Tanzania","Kenya","Afghanistan","South Africa","Malawi","Benin","Congo","Niger","Zimbabwe","Burkina Faso","Guinea","Togo","Uganda","Zambia","Mali","Cameroon","Burundi","Equatorial Guinea","South Sudan","Guinea-Bissau","Nigeria","Swaziland","Somalia","Cote d'Ivoire","Mozambique","Democratic Republic of the Congo","Angola","Central African Republic","Chad","Lesotho","Sierra Leone"];
	var averageLifeExpectancy = [84,83,83,83,83,83,83,83,82,82,82,82,82,82,82,82,82,82,81,81,81,81,81,81,81,81,81,81,80,80,80,80,80,79,79,79,79,79,79,78,78,78,78,77,77,77,77,77,77,77,77,77,77,77,76,76,76,76,76,76,76,76,76,76,76,76,75,75,75,75,75,75,75,75,75,75,75,75,75,75,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,74,73,73,73,73,72,72,72,72,72,72,72,71,71,71,71,71,71,71,70,70,70,70,70,69,69,69,69,69,69,69,68,68,68,68,68,68,68,67,67,67,66,66,66,66,66,65,65,64,64,64,64,63,63,63,63,63,63,62,62,62,62,62,62,61,61,61,61,60,59,59,59,59,59,58,58,58,58,57,57,57,56,56,55,55,54,54,54,53,53,53,52,51,51,51,50,46];
	var maleLifeExpectancy = [80,80,79,80,81,80,81,83,80,80,79,81,81,80,79,80,80,80,78,78,78,79,79,79,79,79,79,79,78,77,77,78,78,76,75,77,76,76,79,75,75,74,78,73,73,71,75,75,74,75,76,76,76,76,72,72,71,73,73,76,74,74,74,73,73,73,71,71,71,73,72,72,72,72,71,74,73,73,72,72,68,69,72,71,71,71,71,70,70,69,72,72,70,72,72,72,73,72,70,69,70,71,67,68,70,69,68,70,70,66,67,66,69,69,69,74,67,66,66,68,69,63,67,66,67,65,68,67,62,63,66,65,68,67,67,64,65,64,64,65,64,64,64,64,63,63,62,62,62,60,60,61,61,61,62,60,61,61,61,60,60,60,59,59,59,58,56,58,57,57,59,56,57,57,57,56,55,57,55,54,54,54,53,53,52,51,52,52,50,50,50,50,49,45];
	var femaleLifeExpectancy = [87,86,86,85,85,85,85,84,84,84,85,84,84,84,85,84,84,84,85,84,84,83,82,83,83,84,83,84,83,83,83,82,82,83,83,81,81,81,80,81,81,81,79,81,81,81,80,80,80,79,78,78,78,78,80,80,80,79,79,78,78,78,78,78,78,78,79,79,79,78,78,78,78,78,78,77,77,77,77,77,80,79,78,78,78,78,78,78,78,78,77,77,77,76,76,76,75,75,77,77,76,75,78,77,75,75,75,74,73,76,75,75,74,73,73,69,74,74,73,72,71,75,73,73,72,72,70,70,76,72,70,70,69,69,69,72,69,69,69,68,68,68,67,66,66,66,65,65,65,67,67,66,65,65,64,65,64,64,63,63,63,63,63,63,62,61,62,60,60,60,59,60,59,59,59,58,58,57,57,57,57,56,56,55,55,55,54,54,53,52,52,52,52,46];

	var ageArray = averageLifeExpectancy;
	if(gender.value === 'M') {
		ageArray = maleLifeExpectancy;
	} else if(gender.value === 'F') {
		ageArray = femaleLifeExpectancy;
	}

	var countryIndex = countryList.indexOf(country.value);
	if(countryIndex === -1) {
		var sum = 0;
		ageArray.forEach(function(num){sum+=parseFloat(num) || 0;});
		sum = Math.round(sum/ageArray.length);
		return sum;
	} else {
		return ageArray[countryIndex];
	}

}

rule Initialize {
	salience: 1000;
	when {
		age : Age;
	}
	then {
		assert(new Result());
	}
}

rule LifeExpectancy {
	salience: 11;
	when {
		gender : Gender;
		country : Country;
		result: Result;
	}
	then {
		if(result.temp.length === 0) {
			result.temp.push(returnDeathAge(gender, country));
		}
	}
}

rule YearsLeft {
	salience: 10;
	when {
		age : Age;
		result: Result;
	}
	then {
		result.value = result.temp[0] - age.value;
	}
}
`

});

Input.bulkCreate([
	{"id": 1, "name": "Gender", "rule_id": 1},
	{"id": 2, "name": "Country", "rule_id": 1},
	{"id": 3, "name": "Age", "rule_id": 1}
]);

Condition.bulkCreate([
	{"input_id": 1, "operator": "=", value: "M", "rule_id": 1},
	{"input_id": 2, "operator": "=", value: "USA", "rule_id": 1},
	{"input_id": 3, "operator": "=", value: "28", "rule_id": 1}
]);

Output.bulkCreate([
	{"id": 1, "name": "YearsLeft", "rule_id": 1},
	{"id": 2, "name": "LifeExpectancy", "rule_id": 1}
]);

Assignment.bulkCreate([
	{"output_id": 1, value: "60", "rule_id": 1},
	{"output_id": 2, value: "88", "rule_id": 1}
]);