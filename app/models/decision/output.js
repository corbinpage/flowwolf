module.exports = function(db, Sequelize) {
	var Output = db.define("Output", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		name: { type: Sequelize.STRING},
		rule_id: Sequelize.INTEGER
	}, {
		tableName: 'outputs',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Output.belongsTo(models.Decision)
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

	return Output;
};