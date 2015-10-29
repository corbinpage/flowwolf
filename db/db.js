var MongoClient = require('mongoskin');
var db = MongoClient.db("mongodb://localhost:27017/dev", {native_parser: true});

module.exports = db;