global.__base = __dirname + '/../../';
var Sequelize = require('sequelize');
var db = require(__base + 'app/db/db');
var models = require(__base + 'app/models/index');


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

// var decision = models.Decision.create({
// 	"id": 2,
// 	"name": "Life Expectancy",
// 	"description": "Life Expectancy around the world!",
// 	"slug": "lifeExpectancy",
// 	"service": "node-rules"
// });

// decision.then(function(decision) {

// 	models.Input.bulkCreate([
// 		{"name": "gender", "decision_id": decision.id},
// 		{"name": "country", "decision_id": decision.id},
// 		{"name": "age", "decision_id": decision.id}
// 		]);

// 	models.Output.bulkCreate([
// 		{"name": "yearsLeft", "decision_id": decision.id},
// 		{"name": "lifeExpectancy", "decision_id": decision.id}
// 		]);

// 	var rules = models.Rule.bulkCreate([
// 		{"decision_id": decision.id, "name":"getDeathAge", "priority": 10},
// 		{"decision_id": decision.id, "name":"getYearsLeft", "priority": 4}
// 		]);

// 	rules.then(function(data) {

// 		models.Rule.findAll({
// 			where: {decision_id: decision.id},
// 		}).then(function(rules) {

// 			models.Condition.bulkCreate([
// 				{"rule_id": rules[0]["id"], "expression": "this.transactionTotal < 500"},
// 				{"rule_id": rules[1]["id"], "expression": "this.lifeExpectancy >= this.age"}
// 				]);

// 			models.Action.bulkCreate([
// 				{"rule_id": rules[0]["id"], "expression": "this.results = false;"},
// 				{"rule_id": rules[0]["id"], "expression": "this.reason = 'The transaction was blocked as it was less than 500';"},
// 				{"rule_id": rules[1]["id"], "expression": "this.results = false"},
// 				{"rule_id": rules[1]["id"], "expression": "this.lifeExpectancy = this.yearsLeft - this.age"}
// 				]);

// 		})
// 	});
// });

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
		{"name": "results", "decision_id": decision.id},
		{"name": "reason", "decision_id": decision.id}
		]);

	var rules = models.Rule.bulkCreate([
		{"decision_id": decision.id, "name":"isDebit", "priority": 10},
		{"decision_id": decision.id, "name":"Less than 500", "priority": 4}
		]);

	rules.then(function(data) {

		models.Rule.findAll({
			where: {decision_id: decision.id},
		}).then(function(rules) {

			models.Condition.bulkCreate([
				{"rule_id": rules[0]["id"], "expression": "this.transactionTotal < 500"},
				{"rule_id": rules[1]["id"], "expression": "this.cardType === 'Debit'"}
				]);

			models.Action.bulkCreate([
				{"rule_id": rules[0]["id"], "expression": "this.results = false;"},
				{"rule_id": rules[0]["id"], "expression": "this.reason = 'The transaction was blocked as it was less than 500';"},
				{"rule_id": rules[1]["id"], "expression": "this.results = false;"},
				{"rule_id": rules[1]["id"], "expression": "this.reason = 'The transaction was blocked as debit cards are not allowed';"}
				]);

		})
	});
});