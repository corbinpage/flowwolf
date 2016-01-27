module.exports = function(db, Sequelize) {
	var Condition = db.define("Condition", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		expression: { type: Sequelize.TEXT}
	}, {
		tableName: 'conditions',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Condition.belongsTo(models.Rule)
			}
		}
	});

	return Condition;
};