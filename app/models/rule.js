var Sequelize = require('sequelize');
var db = require(__base + 'app/db/db');
var Input = require(__base + 'app/models/input');
var Output = require(__base + 'app/models/output');
var Condition = require(__base + 'app/models/condition');
var Assignment = require(__base + 'app/models/assignment');

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

Rule.hasMany(Input);
Rule.hasMany(Output);
Rule.hasMany(Condition);
Rule.hasMany(Assignment);

module.exports = Rule;