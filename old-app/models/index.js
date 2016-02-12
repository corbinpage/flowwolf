var fs = require("fs");
var db = require(__base + 'app/db/db');

var models = {};
var directories = ['/user', '/decision', '/run'];

var pathes = [];
directories.forEach(function(d){
  var tempFiles = fs.readdirSync(__dirname + d);
  var tempPathes = tempFiles.map(function(f) {
    return __dirname + d + '/' + f;
  })
  pathes = pathes.concat(tempPathes);
})

pathes
  .filter(function(path) {
    return (path.indexOf(".") !== 0) && (path.indexOf("index.js") !== 0);
  })
  .forEach(function(path) {
    var model = db.import(path);
    models[model.name] = model;
  });

Object.keys(models).forEach(function(modelName) {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = models;