module.exports = function(db, Sequelize) {
	var Input = db.define("Input", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		name: { type: Sequelize.STRING},
		rule_id: Sequelize.INTEGER
	}, {
		tableName: 'inputs',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Input.belongsTo(models.Decision),
				Input.belongsTo(models.Condition)
			}
		},
		instanceMethods: {
			getDisplay: function() {
				var display = {};
				display[this.id] = this.value;
				return display;
			}
		}
	});

	return Input;
};