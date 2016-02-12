global.__base = __dirname + '/../../';
var Sequelize = require('sequelize');
var db = require(__base + 'app/db/db');
var models = require(__base + 'app/models/index');

// models.User.bulkCreate([
// 	{"username": "cpage", "password": "test", "displayName": "Corbin", "email": "corbin.page@gmail.com"},
// 	{"username": "jselt", "password": "test", "displayName": "Jess", "email": "corbin.page@gmail.com"},
// 	{"username": "bpage", "password": "test", "displayName": "Brett", "email": "corbin.page@gmail.com"},
// 	{"username": "aconley", "password": "test", "displayName": "Alex", "email": "corbin.page@gmail.com"}
// 	]);

var decision = models.Decision.create({
	"id": 1,
	"name": "Life Expectancy",
	"description": "Life Expectancy around the world!",
	"slug": "lifeExpectancy",
	"service": "node-rules"
});

decision.then(function(decision) {

	models.Input.bulkCreate([
		{"name": "gender", "decision_id": decision.id},
		{"name": "country", "decision_id": decision.id},
		{"name": "age", "decision_id": decision.id}
		]);

	models.Output.bulkCreate([
		{"name": "countryArray", "decision_id": decision.id},
		{"name": "yearsLeft", "decision_id": decision.id},
		{"name": "lifeExpectancy", "decision_id": decision.id}
		]);

	var rules = models.Rule.bulkCreate([
		{"decision_id": decision.id, "name":"getGenderArrayM", "order": 1},
		{"decision_id": decision.id, "name":"getGenderArrayF", "order": 2},
		{"decision_id": decision.id, "name":"getGenderArrayElse", "order": 3},
		{"decision_id": decision.id, "name":"getDeathAge", "order": 4},
		{"decision_id": decision.id, "name":"getYearsLeft", "order": 5}
		]);

	rules.then(function(data) {

		models.Rule.findAll({
			where: {decision_id: decision.id},
		}).then(function(rules) {

			models.Condition.bulkCreate([

				{"rule_id": rules[0]["id"], "expression": "this.gender === 'M'"},
				{"rule_id": rules[1]["id"], "expression": "this.gender === 'F'"},
				{"rule_id": rules[2]["id"], "expression": "!this.countryArray"},
				{"rule_id": rules[3]["id"], "expression": "this.country !== null && this.ageArray !== null"},
				{"rule_id": rules[4]["id"], "expression": "this.lifeExpectancy >= this.age"}
				]);

			models.Action.bulkCreate([
				{"rule_id": rules[0]["id"], "expression": "this.ageArray = [78, 80, 71, 71, 72]"},
				{"rule_id": rules[1]["id"], "expression": "this.ageArray = [76, 87, 73, 71, 72]"},
				{"rule_id": rules[2]["id"], "expression": "this.ageArray = [77, 84, 72, 71, 72]"},
				{"rule_id": rules[3]["id"], "expression": "this.lifeExpectancy = this.ageArray[['usa', 'japan','australia','france','iceland'].indexOf(this.country ? this.country.toLowerCase() : '')]"},
				{"rule_id": rules[4]["id"], "expression": "this.yearsLeft = this.lifeExpectancy - this.age"}
				]);

		})
});
});











// Transaction Rules
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var decision = models.Decision.create({
	"id": 2,
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
		{"decision_id": decision.id, "name":"isDebit", "order": 1},
		{"decision_id": decision.id, "name":"Less than 500", "order": 2}
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
				{"rule_id": rules[0]["id"], "expression": "this.results = false"},
				{"rule_id": rules[0]["id"], "expression": "this.reason = 'The transaction was blocked as it was less than 500'"},
				{"rule_id": rules[1]["id"], "expression": "this.results = false"},
				{"rule_id": rules[1]["id"], "expression": "this.reason = 'The transaction was blocked as debit cards are not allowed'"}
				]);

		})
	});
});