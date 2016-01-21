var Nools = require('nools/index.js');

var NoolsService = function(data) {
	this.title = data.name;
	this.slug = data.slug;
	this.inputs = data.Inputs.map(function(i) {return i.name});
	this.outputs = data.Outputs.map(function(o) {return o.name});
	this.nools = data.nools;

	this.session;
	this.inputObjects = [];
	this.outputObjects = [];
	this.loadCustomObjects();
	this.setSession();
};

NoolsService.prototype.setInputs = function(inputs) {
	var thisSession = this.session;
	this.inputObjects.forEach(function(InputObject){
		if(inputs[InputObject.paramLabel]) {
			var input = new InputObject(inputs[InputObject.paramLabel]);
			thisSession.assert(input);
		}
	});
};

NoolsService.prototype.setSession = function() {
	var noolsNoolsService;

	if(Nools.hasFlow(this.slug)) {
		noolsNoolsService = Nools.getFlow(this.slug);
	} else {
		noolsNoolsService = Nools.compile(this.nools, {
			name: this.slug,
			scope: {
				logger: String,
				temp: {}
			},
			define: this.objectDefinitions()
		});
	}

	this.session = noolsNoolsService.getSession();
};

NoolsService.prototype.getOutputs = function() {
	var thisSession = this.session;
	var returnOutputs = [];

	this.outputObjects.forEach(function (obj) {
		var output = thisSession.getFacts(obj);
		if(output.length) {
			output.forEach(function(o) {
				returnOutputs.push(o[0].getDisplay());	
			})			
		}
	});

	return returnOutputs;
};

NoolsService.prototype.objectDefinitions = function() {
	var customObjects = {};

	this.inputObjects.forEach(function(obj) {
		customObjects[obj.className] = obj; 
	})

	this.outputObjects.forEach(function(obj) {
		customObjects[obj.className] = obj; 
	})

	return customObjects;
};

NoolsService.prototype.loadCustomObjects = function() {
	var inherits = require("util").inherits;
	var Input = require(__base + 'app/models/bin/input');
	var Output = require(__base + 'app/models/bin/output');
	var thisNoolsService = this;

	thisNoolsService.inputs.forEach(function(className) {
		var newObject = function(value) {
			newObject.super_.call(this, className, value);
		};
		inherits(newObject, Input);
		newObject.className = className;
		newObject.paramLabel = className.toLowerCase();;

		thisNoolsService.inputObjects.push(newObject);
	});

	thisNoolsService.outputs.forEach(function(className) {
		var newObject = function(id) {
			newObject.super_.call(this, id);
		};
		inherits(newObject, Output);
		newObject.className = className;

		thisNoolsService.outputObjects.push(newObject);
	});
};

NoolsService.prototype.dispose = function() {
	this.session.dispose();
	Nools.deleteFlow(this.slug);
};

module.exports = NoolsService;