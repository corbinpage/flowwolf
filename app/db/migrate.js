global.__base = __dirname + '/../../';
var db = require(__base + 'app/db/db');
var models = require(__base + 'app/models/persistent/index');

db.sync({force: true});