var Sequelize = require("sequelize");
var db = require('./db.js');

var Rule = db.define('rule', {
	tableName: 'rules',
	underscored: true,
	id: {type: Sequelize.INTEGER, primaryKey: true},
	name: { type: Sequelize.STRING}
});

var Input = db.define('input', {
	tableName: 'inputs',
	underscored: true,
	id: {type: Sequelize.INTEGER, primaryKey: true},
	name: { type: Sequelize.STRING},
	rule_id: {
		type: Sequelize.INTEGER,
		references: {
			model: Rule,
			key: 'id'
		}
	}
});

var Output = db.define('output', {
	tableName: 'outputs',
	underscored: true,
	id: {type: Sequelize.INTEGER, primaryKey: true},
	name: { type: Sequelize.STRING},
	rule_id: {
		type: Sequelize.INTEGER,
		references: {
			model: Rule,
			key: 'id'
		}
	}
});

var Condition = db.define('condition', {
	tableName: 'conditions',
	underscored: true,
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
});

var Assignment = db.define('assignment', {
	tableName: 'assignments',
	underscored: true,
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
});

module.exports = {
    Rule: Rule,
    Input: Input,
    Output: Output,
    Condition: Condition,
    Assignment: Assignment
};