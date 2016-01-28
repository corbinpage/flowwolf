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

NodeRulesService.prototype.createCondition = function(conditions) {
  var context = vm.createContext({});
  var expressions = conditions.map(function(c) {
    return c.expression;
  });

  console.log(expressions);

  var script = vm.createScript(
    '(function(R) { R.when(' + 
      expressions +
      '); })'
  );

  return script.runInContext(context);
}

NodeRulesService.prototype.createAction = function(actions) {
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

NodeRulesService.prototype.setRule = function(ruleData) {
  var context = vm.createContext({});
  var rule = {}
  rule.name = ruleData.name;
  rule.priority = ruleData.priority;
  rule.condition = this.createCondition(ruleData.Conditions);
  rule.consequence = this.createAction(ruleData.Actions);

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

  function executeAsync (inputs) {
    var deferred = Q.defer();
    thisSession.execute(inputs, function (data) {
      if (!data) deferred.reject(data)
        else deferred.resolve(data)
          deferred.resolve(data)
      })
    return deferred.promise
  }

  return executeAsync(this.inputs);
};

module.exports = NodeRulesService;