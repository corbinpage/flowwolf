var nools = require("node_modules/nools/index.js");

var flow = nools.compile(__dirname + "/lifeExpectancy.nools")

var session = flow.getSession();

session.assert(1, 1);
session.match();