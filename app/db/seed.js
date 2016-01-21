global.__base = __dirname + '/../../';
var Sequelize = require('sequelize');
var db = require(__base + 'app/db/db');
var models = require(__base + 'app/models/index');

// Life Expectancy Rules
models.Decision.create({
	"id": 1,
	"name": "Life Expectancy",
	"description": "Life Expectancy around the world!",
	"slug": "lifeExpectancy",
	"nools": `
	function returnDeathAge(gender, country) {
		var countryList = ["USA", "Japan","Australia","France","Iceland"];
		var averageLifeExpectancy = [77, 84, 72, 71, 72];
		var maleLifeExpectancy = [78, 80, 71, 71, 72];
		var femaleLifeExpectancy = [76, 87, 73, 71, 72];

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
			assert(new YearsLeft("YearsLeft"));
			assert(new LifeExpectancy("LifeExpectancy"));
		}
	}

	rule LifeExpectancy {
		salience: 11;
		when {
			gender : Gender;
			country : Country;
			yearsLeft: YearsLeft;
			lifeExpectancy: LifeExpectancy;
		}
		then {
			if(!lifeExpectancy.value) {
				lifeExpectancy.value = returnDeathAge(gender, country);
			}
		}
	}

	rule YearsLeft {
		salience: 10;
		when {
			age : Age;
			yearsLeft: YearsLeft;
			lifeExpectancy: LifeExpectancy;
		}
		then {
			yearsLeft.value = lifeExpectancy.value  - age.value;
		}
	}
	`
});

models.Rule.create({
	"id": 1,
	"decision_id": 1,
	"name": "Life Expectancy",
	"slug": "lifeExpectancy",
	"description": "Life Expectancy around the world!"
});

models.Input.bulkCreate([
	{"id": 1, "name": "Gender", "decision_id": 1},
	{"id": 2, "name": "Country", "decision_id": 1},
	{"id": 3, "name": "Age", "decision_id": 1}
	]);

models.Condition.bulkCreate([
	{"input_id": 1, "operator": "=", value: "M", "rule_id": 1},
	{"input_id": 2, "operator": "=", value: "USA", "rule_id": 1},
	{"input_id": 3, "operator": "=", value: "28", "rule_id": 1}
	]);

models.Output.bulkCreate([
	{"id": 1, "name": "YearsLeft", "decision_id": 1},
	{"id": 2, "name": "LifeExpectancy", "decision_id": 1}
	]);

models.Action.bulkCreate([
	{"output_id": 1, value: "60", "decision_id": 1},
	{"output_id": 2, value: "88", "decision_id": 1}
	]);