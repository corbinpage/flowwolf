module.exports = function(db, Sequelize) {
	var InputRun = db.define("InputRun", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		recognized: { type: Sequelize.BOOLEAN},
		param: { type: Sequelize.TEXT},
		value: { type: Sequelize.TEXT}
	}, {
		tableName: 'input_runs',
		underscored: true,
		classMethods: {
			associate: function(models) {
				InputRun.belongsTo(models.Run),
				InputRun.belongsTo(models.Input)
			}
		},
	});

	return InputRun;
};