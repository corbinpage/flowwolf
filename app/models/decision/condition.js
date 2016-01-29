var vm = require('vm');

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
			},

			formatForNodeRules: function(conditions) {
        var context = vm.createContext({});

        var expressions = conditions.map(function(a) {
            return a.expression;
          })
          .join(' && ');

        var script = vm.createScript(
          '(function(R) {' + 
            'R.when(' + 
              expressions +
              '); })'
        );

        return script.runInThisContext(context);
      }

    }
  });

	return Condition;
};