var nools = require("node_modules/nools/index.js");

// var flow = nools.flow("Hello World", function (flow) {

var flow = nools.compile(__dirname + "/helloworld.nools")
    Message = flow.getDefined("message");

var session = flow.getSession();
//assert your different messages
session.assert(new Message("goodbye"));
session.assert(new Message("hello"));
session.assert(new Message("hello world"));
session.match();


//same as above getSession will assert the passed in objects
var session2 = flow.getSession(
	new Message("goodbye"),
	new Message("hello"),
	new Message("hello world")
	);
session2.match();
