global.__base = __dirname + '/../../';
var Sequelize = require('sequelize');
var db = require(__base + 'app/db/db');
var Rule = require(__base + 'app/models/rule');
var Input = require(__base + 'app/models/input');
var Output = require(__base + 'app/models/output');
var Condition = require(__base + 'app/models/condition');
var Assignment = require(__base + 'app/models/Assignment');

db.sync({force: true});