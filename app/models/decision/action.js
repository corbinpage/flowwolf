var vm = require('vm');

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
			},

			formatForNodeRules: function(actions) {
        var context = vm.createContext({});
        var expressions = actions.map(function(a) {
          return a.expression;
        });

        var script = vm.createScript(
          '(function(R) {' +
            expressions.join('; ') +
            'R.stop();' +
            '})'
        );

        return script.runInContext(context);
      }

    }
  });

	return Action;
};