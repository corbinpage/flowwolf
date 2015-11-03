var pmongo = require('promised-mongo');
var db = pmongo('mongodb://localhost:27017/dev', ['flow']);

module.exports = db;