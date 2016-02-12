module.exports = function(db, Sequelize) {
	var User = db.define("User", {
		id: {type: Sequelize.INTEGER, primaryKey: true},
		username: { type: Sequelize.STRING, unique: true},
		password: { type: Sequelize.STRING},
		displayName: { type: Sequelize.STRING},
		email: { type: Sequelize.STRING}
	}, {
		tableName: 'users',
		underscored: true,
		classMethods: { 
			associate: function(models) {
				// User.belongsTo(models.Decision),
				// User.hasMany(models.Condition),
				// User.hasMany(models.Action)
			},
			findByUsername: function(username, cb) {
				User.findOne({
					where: {username: username}
				})
				.then(function(user) {
					return user ? cb(null, user) : cb(null, null);
				})
			}
		}
	});

	return User;
};