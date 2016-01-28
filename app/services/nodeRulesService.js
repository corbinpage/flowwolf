var RuleEngine = require('node-rules');
var Q = require('q');
var vm = require('vm');
var models = require(__base + 'app/models/index');

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
  rule.priority = 1000 - ruleData.order;
  rule.condition = models.Condition.formatForNodeRules(ruleData.Conditions);
  rule.consequence = models.Action.formatForNodeRules(ruleData.Actions);

  return rule;
}

NodeRulesService.prototype.setSession = function(rulesData) {
  var thisService = this;
  var rules = rulesData.map(function(r) {
    return thisService.setRule(r);
  })

  this.session = new RuleEngine(rules, {ignoreFactChanges: true});
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