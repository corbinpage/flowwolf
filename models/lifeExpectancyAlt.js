var Input = require("./structure.js");
var inherits = require('util').inherits;

function Gender(key, value) {
  this.key = key;
  this.value = value;
}
inherits(Gender, Input);


// var Gender = function(key, value) {
//   this.key = key;
//   this.value = value;
// }