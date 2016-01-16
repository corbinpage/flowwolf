var Sequelize = require("sequelize");
var db = require('./db.js');
var models = require('./models.js');

var Rule = models.Rule;
var Input = models.Input;
var Output = models.Output;
var Condition = models.Condition;
var Assignment = models.Assignment;


// Life Expectancy Rules

var rules = new Rule(
	{"id": 1, "name": "Life Expectancy", "slug": "lifeExpectancy"}
);
rules.sync();

var inputs = new Input[
	{"name": "Gender", "rule_id": 1},
	{"name": "Country", "rule_id": 1},
	{"name": "Age", "rule_id": 1}
];
inputs.sync();

var outputs = new Output[
	{"name": "YearsLeft", "rule_id": 1},
	{"name": "LifeExpectancy", "rule_id": 1}
];
outputs.sync();