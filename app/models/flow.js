var Nools = require('nools/index.js');

var Flow = function(data) {
	this.title = data.title;
	this.slug = data.slug;
	this.inputs = data.inputs.map(function(i) {return i.name});
	this.outputs = data.outputs.map(function(o) {return o.name});
	this.nools = data.nools;

	this.inputObjects = [];
	this.outputObjects = [];
	this.loadCustomObjects();
};

Flow.prototype.objectDefinitions = function() {
	var customObjects = {};

	this.inputObjects.forEach(function(obj) {
		customObjects[obj.className] = obj; 
	})

	this.outputObjects.forEach(function(obj) {
		customObjects[obj.className] = obj; 
	})

	return customObjects;
};

Flow.prototype.loadCustomObjects = function() {
	var inherits = require("util").inherits;
	var Input = require(__base + 'app/models/bin/input');
	var Output = require(__base + 'app/models/bin/output');
	var thisFlow = this;

	thisFlow.inputs.forEach(function(className) {
		var newObject = function(value) {
			newObject.super_.call(this, className, value);
		};
		inherits(newObject, Input);
		newObject.className = className;
		newObject.paramLabel = className.toLowerCase();;

		thisFlow.inputObjects.push(newObject);
	});

	thisFlow.outputs.forEach(function(className) {
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

	if(Nools.hasFlow(this.slug)) {
		noolsFlow = Nools.getFlow(this.slug);
	} else {
		noolsFlow = Nools.compile(__base + 'app/models/rules/' + this.slug + '.nools', {
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