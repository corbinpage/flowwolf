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
        var expressions = conditions.map(function(c) {
          return c.expression;
        });

        var script = vm.createScript(
          '(function(R) {' + 

            'console.log(1000 - R.rule().priority + ": " + R.rule().name);' +
            'console.log("' + expressions + '");' +
            'console.log(' + expressions + ');' +

            'console.log(R.rule().on);' +
            'console.log(R.rule().priority);' +

            'R.when(' + 
            expressions.join(' && ') +
            '); })'
        );

        return script.runInThisContext(context);
      }

    }
  });

	return Condition;
};