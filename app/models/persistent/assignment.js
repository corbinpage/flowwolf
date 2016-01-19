module.exports = function(db, Sequelize) {
	var Assignment = db.define("Assignment", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		value: { type: Sequelize.TEXT}
	}, {
		tableName: 'assignments',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Assignment.belongsTo(models.Rule),
				Assignment.hasOne(models.Output)
			}
		}
	});

	return Assignment;
};