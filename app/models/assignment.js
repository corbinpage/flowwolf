var Sequelize = require("sequelize");
var db = require(__base + 'app/db/db');
var Rule = require(__base + 'app/models/rule');
var Output = require(__base + 'app/models/output');

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

module.exports = Assignment;