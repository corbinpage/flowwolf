var Sequelize = require("sequelize");
var db = require('./db');
var models = require('./models');

var Rule = models.Rule,
		Input = models.Input,
		Output = models.Output,
		Condition = models.Condition,
		Assignment = models.Assignment;

db.sync({force: true});