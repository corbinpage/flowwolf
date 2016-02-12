module.exports = function(db, Sequelize) {
	var Decision = db.define("Decision", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		name: { type: Sequelize.STRING},
		description: { type: Sequelize.TEXT},
		executionType: { type: Sequelize.STRING},
		slug: { type: Sequelize.STRING},
		service: { type: Sequelize.STRING},
		nools: { type: Sequelize.TEXT}
	}, {
		tableName: 'decisions',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Decision.hasMany(models.Rule),
				Decision.hasMany(models.Input),
				Decision.hasMany(models.Output),
				Decision.hasMany(models.Run)
			}
		}
	});

	return Decision;
};