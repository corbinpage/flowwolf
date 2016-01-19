module.exports = function(db, Sequelize) {
	var Condition = db.define("Condition", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		value: { type: Sequelize.TEXT},
		operator: { type: Sequelize.STRING},
		value: { type: Sequelize.TEXT}
	}, {
		tableName: 'conditions',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Condition.belongsTo(models.Rule),
				Condition.hasOne(models.Input)
			}
		}
	});

	return Condition;
};