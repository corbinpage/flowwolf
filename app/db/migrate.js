global.__base = __dirname + '/../../';
var db = require(__base + 'app/db/db');
var models = require(__base + 'app/models/index');

db.sync({force: true});