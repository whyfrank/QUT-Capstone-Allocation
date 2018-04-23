var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IT Capstone' });
});

/* GET view projects. */
router.get('/viewprojects', function(req, res, next) {
  res.render('viewprojects', {layout: false});
});

module.exports = router;
