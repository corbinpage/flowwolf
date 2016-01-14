var Sequelize = require("sequelize");

var db = new Sequelize('dev-db', 'cpage', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: 'db/database.sqlite'
});

module.exports = db;

// Or you can simply use a connection uri
// var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');