var RuleEngine = require('node-rules');
var Q = require('q');
var vm = require('vm');

var NodeRulesService = function(data) {
	this.inputs = {};
	this.outputs = {};
  this.setSession(data.Rules);
};

NodeRulesService.prototype.setInputs = function(inputs) {
  this.inputs = inputs;
};

NodeRulesService.prototype.setRule = function(ruleData) {
  var context = vm.createContext({});
  var rule = {}
  rule.name = ruleData.name;
  rule.priority = ruleData.priority;

  var conditionScript = vm.createScript('(' + ruleData.Conditions[0]["expression"] + ')');
  rule.condition = conditionScript.runInContext(context);

  console.log(ruleData.Actions[0]["expression"]);

  var actionScript = vm.createScript(ruleData.Actions[0]["expression"]);
  rule.consequence = actionScript.runInContext(context);

  return rule;
}

NodeRulesService.prototype.setSession = function(rulesData) {
  var thisService = this;
  var rules = rulesData.map(function(r) {
    return thisService.setRule(r);
  })

  this.session = new RuleEngine();
  this.session.register(rules);
};

NodeRulesService.prototype.run = function() {
	var thisSession = this.session;

	function executeRules (inputs) {
		var deferred = Q.defer();
		thisSession.execute(inputs, function (data) {
			if (!data) deferred.reject(data)
				else deferred.resolve(data)
          deferred.resolve(data)
      })
		return deferred.promise
	}

	return executeRules(this.inputs);
};

module.exports = NodeRulesService;