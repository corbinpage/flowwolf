module.exports = function(db, Sequelize) {
	var ConditionRun = db.define("ConditionRun", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		outcome: { type: Sequelize.BOOLEAN},
		order: { type: Sequelize.INTEGER},
		startTime: { type: Sequelize.DATE},
		endTime: { type: Sequelize.DATE},
		success: { type: Sequelize.BOOLEAN},
		error: { type: Sequelize.TEXT}
	}, {
		tableName: 'condition_runs',
		underscored: true,
		classMethods: {
			associate: function(models) {
				ConditionRun.belongsTo(models.Run),
				ConditionRun.belongsTo(models.Rule)
				// ConditionRun.belongsTo(models.Condition)
			}
		},
	});

	return ConditionRun;
};