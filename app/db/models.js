var Sequelize = require("sequelize");
var db = require('./db');

var Rule = db.define('rule', {
	id: {type: Sequelize.INTEGER, primaryKey: true},
	name: { type: Sequelize.STRING},
	slug: { type: Sequelize.STRING},
	nools: { type: Sequelize.TEXT}
},
{
	tableName: 'rules',
	underscored: true
});

var Input = db.define('input', {
	id: {type: Sequelize.INTEGER, primaryKey: true},
	name: { type: Sequelize.STRING},
	rule_id: {
		type: Sequelize.INTEGER,
		references: {
			model: Rule,
			key: 'id'
		}
	}
},
{
	tableName: 'inputs',
	underscored: true
});

var Output = db.define('output', {
	id: {type: Sequelize.INTEGER, primaryKey: true},
	name: { type: Sequelize.STRING},
	rule_id: {
		type: Sequelize.INTEGER,
		references: {
			model: Rule,
			key: 'id'
		}
	}
},
{
	tableName: 'outputs',
	underscored: true
});

var Condition = db.define('condition', {
	id: {type: Sequelize.INTEGER, primaryKey: true},
	rule_id: {
		type: Sequelize.INTEGER,
		references: {
			model: Rule,
			key: 'id'
		}
	},
	input_id: {
		type: Sequelize.INTEGER,
		references: {
			model: Input,
			key: 'id'
		}
	},
	operator: { type: Sequelize.STRING},
	value: { type: Sequelize.TEXT}
},
{
	tableName: 'condition',
	underscored: true
});


var Assignment = db.define('assignment', {
	id: {type: Sequelize.INTEGER, primaryKey: true},
	rule_id: {
		type: Sequelize.INTEGER,
		references: {
			model: Rule,
			key: 'id'
		}
	},
	output_id: {
		type: Sequelize.INTEGER,
		references: {
			model: Output,
			key: 'id'
		}
	},
	value: { type: Sequelize.TEXT}
},
{
	tableName: 'assignments',
	underscored: true
});

Rule.hasMany(Input);
Rule.hasMany(Output);
Rule.hasMany(Condition);
Rule.hasMany(Assignment);
Input.hasMany(Condition);
Output.hasMany(Assignment);

module.exports = {
	Rule: Rule,
	Input: Input,
	Output: Output,
	Condition: Condition,
	Assignment: Assignment
};