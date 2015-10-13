var nools = require("node_modules/nools/index.js");

var flow = nools.compile(__dirname + "/lifeExpectancy.nools", {
	name: "Life Expectancy",
	define: {
		Gender: Gender,
		Country: Country,
		Age: Age,
		Result: Result
	},
	scope: {
		logger: String,
		lifeExpectancy: String
	}
});
var firedRules = [];

var Gender = flow.getDefined("gender");
var Country = flow.getDefined("country");
var Age = flow.getDefined("age");
var Result = flow.getDefined("result");

var session = flow.getSession(new Gender('M'), new Country('Andorra'), new Age(27));

session
.on("fire", function (ruleName) {
	firedRules.push(ruleName);
})
.match(function(err){
	if(err){
        console.log("Rules fired: ", firedRules); //[ 'Hello World', 'Hello World2' ]
        console.log(session.getFacts());    	
        console.error(err.stack);
      } else{
        console.log("Rules fired: ", firedRules); //[ 'Hello World', 'Hello World2' ]
        console.log(session.getFacts());
        // var result = session.getFacts(Result);
        console.log("done");
      }
    })