var db = require('./db.js');
var fs = require("fs");

db.bind('flow');

var noolsFilePath = __dirname + '/../models/lifeExpectancy.nools';
var rules = fs.readFileSync(noolsFilePath, 'utf8');

db.flow.insert({
	title: "Life Expectancy",
	slug: "life-expectancy",
	inputs: ["Gender", "Country", "Age"],
	outputs: ["YearsLeft", "LifeExpectancy"],
	rules: rules
});

db.close();