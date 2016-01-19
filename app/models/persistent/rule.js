module.exports = function(db, Sequelize) {
	var Rule = db.define("Rule", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		name: { type: Sequelize.STRING},
		slug: { type: Sequelize.STRING},
		nools: { type: Sequelize.TEXT}
	}, {
		tableName: 'rules',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Rule.hasMany(models.Input)
				Rule.hasMany(models.Output),
				Rule.hasMany(models.Condition),
				Rule.hasMany(models.Assignment)
			}
		}
	});

	return Rule;
};