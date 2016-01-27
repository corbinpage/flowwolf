module.exports = function(db, Sequelize) {
	var Rule = db.define("Rule", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		name: { type: Sequelize.STRING},
		description: { type: Sequelize.TEXT},
		priority: { type: Sequelize.INTEGER},
		slug: { type: Sequelize.STRING}
	}, {
		tableName: 'rules',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Rule.belongsTo(models.Decision),
				Rule.hasMany(models.Condition),
				Rule.hasMany(models.Action)
			}
		}
	});

	return Rule;
};