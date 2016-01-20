module.exports = function(db, Sequelize) {
	var Action = db.define("Action", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		value: { type: Sequelize.TEXT}
	}, {
		tableName: 'actions',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Action.belongsTo(models.Rule),
				Action.hasOne(models.Output)
			}
		}
	});

	return Action;
};