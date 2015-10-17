var nools = require("nools/index.js");

var flow = nools.compile(__dirname + "/lifeExpectancy.nools", {
	name: "Life Expectancy",
	scope: {
		logger: String,
		lifeExpectancy: String
	}
});
var rulesFired = [];

var Gender = flow.getDefined("Gender");
var Country = flow.getDefined("Country");
var Age = flow.getDefined("Age");
var Result = flow.getDefined("Result");
var session = flow.getSession(new Gender('M'), new Country('Andorra'), new Age(27));

session.on("fire", function (ruleName) {
	rulesFired.push(ruleName);
})
.match(function(err){
	if(err){
        console.log("Rules fired: ", rulesFired);
        console.log(session.getFacts());    	
        console.error(err.stack);
        console.log("-----Error-----");
      } 
      else{
        console.log("Rules fired: ", rulesFired);
        console.log(session.getFacts());
        var result = session.getFacts(Result);
        console.log("-----Complete-----");
      }
    })