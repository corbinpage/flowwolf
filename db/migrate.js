var Sequelize = require("sequelize");
var db = require('./db.js');
var models = require('./models.js');

var Rule = models.Rule,
		Input = models.Input,
		Output = models.Output,
		Condition = models.Condition,
		Assignment = models.Assignment;

db.sync({force: true});