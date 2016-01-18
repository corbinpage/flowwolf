var Sequelize = require("sequelize");
var db = require(__base + 'app/db/db');
var Rule = require(__base + 'app/models/rule');
var Input = require(__base + 'app/models/input');

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

module.exports = Condition;