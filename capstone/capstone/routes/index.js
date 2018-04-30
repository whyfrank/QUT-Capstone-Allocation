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

/* GET view teams. */
router.get('/viewteams', function(req, res, next) {
  res.render('viewteams', {layout: false});
});

/* GET view students. */
router.get('/viewstudents', function(req, res, next) {
  res.render('viewstudents', {layout: false});
});

module.exports = router;
