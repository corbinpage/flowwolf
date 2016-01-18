var Sequelize = require("sequelize");
var db = require(__base + 'app/db/db');
var Rule = require(__base + 'app/models/rule');
var Condition = require(__base + 'app/models/condition');

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
	underscored: true,
	instanceMethods: {
		getDisplay: function() {
			var display = {};
			display[this.id] = this.value;
			return display;
		}
	}
});

Input.type = 'input';
Input.hasMany(Condition);

module.exports = Input;