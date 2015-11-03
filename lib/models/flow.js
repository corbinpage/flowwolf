var Db = require(__base + 'db/db.js');
var Nools = require('nools/index.js');

var Flow = function(data) {
	// for(var k in data) this[k] = data[k];
	this.title = data.title;
	this.slug = data.slug;
	this.inputs = data.inputs;
	this.outputs = data.outputs;
	this.rules = data.rules;

	this.inputObjects = [];
	this.outputObjects = [];
	this.loadCustomObjects();
};

Flow.findBySlug = function(slug) {
	console.log('-----Search-----');
	console.log('slug: ' + slug);
	var promise = Db.flow.findOne({slug: slug});
	return promise;
};

Flow.prototype.objectDefinitions = function() {
	var customObjects = {};

	_.each(this.inputObjects,function(obj) {
		customObjects[obj.className] = obj; 
	})

	_.each(this.outputObjects,function(obj) {
		customObjects[obj.className] = obj; 
	})

	return customObjects;
};

Flow.prototype.loadCustomObjects = function() {
	var inherits = require("util").inherits;
	var Input = require(__base + 'lib/models/bin/input.js');
	var Output = require(__base + 'lib/models/bin/output.js');
	var thisFlow = this;

	_.each(thisFlow.inputs, function(className) {
		var newObject = function(value) {
			newObject.super_.call(this, className.toLowerCase(), value);
		};
		inherits(newObject, Input);
		newObject.className = className;
		newObject.paramLabel = className.toLowerCase();

		thisFlow.inputObjects.push(newObject);
	});

	_.each(thisFlow.outputs, function(className) {
		var newObject = function(id) {
			newObject.super_.call(this, id);
		};
		inherits(newObject, Output);
		newObject.className = className;

		thisFlow.outputObjects.push(newObject);
	});

};

Flow.prototype.getSession = function() {
	var noolsFlow;

	if(Nools.hasFlow(this.title)) {
		noolsFlow = Nools.getFlow(this.slug);
	} else {
		noolsFlow = Nools.compile(this.rules, {
			name: this.title,
			scope: { 
				logger: String,
				temp: {}
			},
			define: this.objectDefinitions()
		});
	}

	return noolsFlow.getSession();
};


Flow.prototype.dispose = function() {
	Nools.deleteFlow(this.title);
};

module.exports = Flow;