var Sequelize = require('sequelize');
var db = require(__base + 'app/db/db');
var Rule = require(__base + 'app/models/rule');
var Assignment = require(__base + 'app/models/assignment');

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
	underscored: true,
	instanceMethods: {
		getDisplay: function() {
			var display = {};
			display[this.id] = this.value;
			return display;
		}
	}
});
// Output.type = 'output';
// Output.prototype.type = 'output';
Output.hasMany(Assignment);

// Output.prototype.getDisplay = function() {
// 	var display = {};
// 	display[this.id] = this.value;
// 	return display;
// };

module.exports = Output;