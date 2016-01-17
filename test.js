var Sequelize = require("sequelize");
var db = require('./db/db.js');
var models = require('./db/models.js');

var Rule = models.Rule;
var Input = models.Input;
var Output = models.Output;
var Condition = models.Condition;
var Assignment = models.Assignment;

Rule.findOne({
	where: {slug: "lifeExpectancy"},
	include: [Input, Output]
}).then(function(rule) {
	console.log(rule);
	console.log(rule.inputs);
	console.log(rule.getInputs());



});