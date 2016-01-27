global.__base = __dirname + '/../../';
var Sequelize = require('sequelize');
var db = require(__base + 'app/db/db');
var models = require(__base + 'app/models/index');

// Life Expectancy Rules
// models.Decision.create({
// 	"id": 1,
// 	"name": "Life Expectancy",
// 	"description": "Life Expectancy around the world!",
// 	"slug": "lifeExpectancy",
// 	"service": "nools",
// 	"nools": `
// 	function returnDeathAge(gender, country) {
// 		var countryList = ["USA", "Japan","Australia","France","Iceland"];
// 		var averageLifeExpectancy = [77, 84, 72, 71, 72];
// 		var maleLifeExpectancy = [78, 80, 71, 71, 72];
// 		var femaleLifeExpectancy = [76, 87, 73, 71, 72];

// 		var ageArray = averageLifeExpectancy;
// 		if(gender.value === 'M') {
// 			ageArray = maleLifeExpectancy;
// 		} else if(gender.value === 'F') {
// 			ageArray = femaleLifeExpectancy;
// 		}

// 		var countryIndex = countryList.indexOf(country.value);
// 		if(countryIndex === -1) {
// 			var sum = 0;
// 			ageArray.forEach(function(num){sum+=parseFloat(num) || 0;});
// 			sum = Math.round(sum/ageArray.length);
// 			return sum;
// 		} else {
// 			return ageArray[countryIndex];
// 		}

// 	}

// 	rule Initialize {
// 		salience: 1000;
// 		when {
// 			age : Age;
// 		}
// 		then {
// 			assert(new YearsLeft("YearsLeft"));
// 			assert(new LifeExpectancy("LifeExpectancy"));
// 		}
// 	}

// 	rule LifeExpectancy {
// 		salience: 11;
// 		when {
// 			gender : Gender;
// 			country : Country;
// 			yearsLeft: YearsLeft;
// 			lifeExpectancy: LifeExpectancy;
// 		}
// 		then {
// 			if(!lifeExpectancy.value) {
// 				lifeExpectancy.value = returnDeathAge(gender, country);
// 			}
// 		}
// 	}

// 	rule YearsLeft {
// 		salience: 10;
// 		when {
// 			age : Age;
// 			yearsLeft: YearsLeft;
// 			lifeExpectancy: LifeExpectancy;
// 		}
// 		then {
// 			yearsLeft.value = lifeExpectancy.value  - age.value;
// 		}
// 	}
// 	`
// });

// models.Rule.create({
// 	"id": 1,
// 	"decision_id": 1,
// 	"name": "Life Expectancy",
// 	"slug": "lifeExpectancy",
// 	"priority": 1,
// 	"description": "Life Expectancy around the world!"
// });

// models.Input.bulkCreate([
// 	{"name": "Gender", "decision_id": 1},
// 	{"name": "Country", "decision_id": 1},
// 	{"name": "Age", "decision_id": 1}
// 	]);

// models.Condition.bulkCreate([
// 	{"input_id": 1, "expression": "temp", "rule_id": 1},
// 	{"input_id": 2, "expression": "temp", "rule_id": 1},
// 	{"input_id": 3, "expression": "temp", "rule_id": 1}
// 	]);

// models.Output.bulkCreate([
// 	{"name": "YearsLeft", "decision_id": 1},
// 	{"name": "LifeExpectancy", "decision_id": 1}
// 	]);

// models.Action.bulkCreate([
// 	{"output_id": 1, "expression": "temp", "rule_id": 1},
// 	{"output_id": 2, "expression": "temp", "rule_id": 1}
// 	]);


// Transaction Rules
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var decision = models.Decision.create({
	"id": 1,
	"name": "Transaction",
	"description": "Check whether a transaction is valid.",
	"slug": "transaction",
	"service": "node-rules"
});

decision.then(function(decision) {

	models.Input.bulkCreate([
		{"name": "name", "decision_id": decision.id},
		{"name": "application", "decision_id": decision.id},
		{"name": "transactionTotal", "decision_id": decision.id},
		{"name": "cardType", "decision_id": decision.id}
		]);

	models.Output.bulkCreate([
		{"name": "result", "decision_id": decision.id},
		{"name": "reason", "decision_id": decision.id}
		]);

	var rules = models.Rule.bulkCreate([
		{"decision_id": decision.id, "name":"isDebit", "priority": 10},
		{"decision_id": decision.id, "name":"Less than 500", "priority": 4}
		],
		{returning: true});

	rules.then(function(data) {

		models.Rule.findAll({
			where: {decision_id: decision.id},
		}).then(function(rules) {

			models.Condition.bulkCreate([
				{"rule_id": rules[0]["id"], "expression": "(function(R) { R.when(this.transactionTotal < 500); })"},
				{"rule_id": rules[1]["id"], "expression": "(function(R) { R.when(this.cardType === 'Debit') })"}
				]);

			models.Action.bulkCreate([
				{"rule_id": rules[0]["id"], "expression": "(function(R) { this.results = false; this.reason = 'The transaction was blocked as it was less than 500'; R.stop(); })"},
				{"rule_id": rules[1]["id"], "expression": "(function(R) { this.results = false; this.reason = 'The transaction was blocked as debit cards are not allowed'; R.stop(); })"}
				]);
		})
	});
});