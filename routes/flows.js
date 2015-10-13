var express = require('express');
var router = express.Router();

/* GET flows listing. */
router.get('/flows', function(req, res, next) {
  res.send('Test Flows');
});

module.exports = router;
