var nools = require("node_modules/nools/index.js");

var flow = nools.compile(__dirname + "/lifeExpectancy.nools");

var Message = flow.getDefined("message");
var Result = flow.getDefined("result");

var fired1 = [], fired2 = [], fired3 = [];

var session = flow.getSession(new Message("hello"), 'M', new Result())

session
.on("fire", function (ruleName) {
	fired3.push(ruleName);
})
.match(function(err){
	if(err){
        console.log("Example 3", fired3); //[ 'Hello World', 'Hello World2' ]
        console.log(session.getFacts());    	
        console.error(err.stack);
      }else{
        console.log("Example 3", fired3); //[ 'Hello World', 'Hello World2' ]
        console.log(session.getFacts(Result));
        console.log("done");
      }
   })