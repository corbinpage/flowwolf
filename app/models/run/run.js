module.exports = function(db, Sequelize) {
	var Run = db.define("Run", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		// inputs: { type: Sequelize.TEXT},
		outputs: { type: Sequelize.TEXT},
		rulesFired: { type: Sequelize.TEXT}
	}, {
		tableName: 'runs',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Run.belongsTo(models.Decision),
				Run.hasMany(models.InputRun),
				Run.hasMany(models.ConditionRun)
			}
		},
	});

	return Run;
};