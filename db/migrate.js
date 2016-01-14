var Sequelize = require("sequelize");
var db = require('./db.js');
var models = require('./models.js');

var Rule = models.Rule,
		Input = models.Input,
		Output = models.Output,
		Condition = models.Condition,
		Assignment = models.Assignment;

Rule.hasMany(Input);
Rule.hasMany(Output);
Rule.hasMany(Condition);
Rule.hasMany(Assignment);
Input.hasMany(Condition);
Output.hasMany(Assignment);

db.sync({force: true});