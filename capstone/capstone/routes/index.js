var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IT Capstone', page: req.query.page});
});

/* GET view projects. */
router.get('/viewprojects', function(req, res, next) {
  res.render('viewprojects', {layout: false});
});

/* GET proposals. */
router.get('/proposals', function(req, res, next) {
  res.render('proposals', {layout: false});
});

/* GET proposal. */
router.get('/proposal', function(req, res, next) {
  res.render('proposal', {layout: false});
});

module.exports = router;
