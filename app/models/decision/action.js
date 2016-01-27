module.exports = function(db, Sequelize) {
	var Action = db.define("Action", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		expression: { type: Sequelize.TEXT}
	}, {
		tableName: 'actions',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Action.belongsTo(models.Rule)
			}
		}
	});

	return Action;
};