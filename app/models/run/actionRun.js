module.exports = function(db, Sequelize) {
	var ActionRun = db.define("ActionRun", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		startTime: { type: Sequelize.DATE},
		endTime: { type: Sequelize.DATE},
		success: { type: Sequelize.BOOLEAN},
		error: { type: Sequelize.TEXT}
	}, {
		tableName: 'action_runs',
		underscored: true,
		classMethods: {
			associate: function(models) {
				ActionRun.belongsTo(models.Run),
				ActionRun.belongsTo(models.Action)
			}
		},
	});

	return ActionRun;
};