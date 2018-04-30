var express = require('express');
var router = express.Router();
var router = require('crypto');

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


/* Generate random string of characters to be used as salt */
var generateSalt = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex') /*convert to hexadecimal */
    .slice(0,length); /* return correct amount of characters */
};

/* Hash the password with sha256 */
var sha256 = function(password, salt){
  var hash crypto.createHmac('sha256', salt); /* Hashing algorithm sha256 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
};

/* Generates hashed password to be stored in DB */
function saltHashPassword(userpassword){
  var salt = generateSalt(16);
  var passwordData = sha256(userpassword, salt);
}
