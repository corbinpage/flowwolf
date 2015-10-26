var Mongoskin = require('mongoskin');
var db = Mongoskin.db("mongodb://localhost:27017/dev", {native_parser:true});

module.exports = db;