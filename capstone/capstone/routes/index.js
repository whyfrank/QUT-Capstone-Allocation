var express = require('express');
var router = express.Router();
var crypto = require('crypto');

//custom route for fetching data
var projects_data = require('../data_access/projects');
var teams_data = require('../data_access/teams');
var students_data = require('../data_access/students');
var login_data = require('../data_access/login');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IT Capstone', page: req.query.page});
});

var projects;

/* GET view projects. */
router.get('/viewprojects', async function(req, res, next) {
  res.render('viewprojects', {layout: false});
});

/* GET view project-list. */
router.get('/project-list', async function(req, res, next) {
	await projects_data.getAllProjects(req.query).then(function (projects) {
		this.projects = projects;
		console.log(projects);
	})
  res.render('project-list', {layout: false, projects: this.projects});
});

/* GET view project. */
router.get('/project', async function(req, res, next) {
	var id = req.query.id;
	await projects_data.getProject(id).then(function (project) {
		this.project = project[0];
		console.log(project);
	})
  res.render('project', {layout: false, project: this.project});
});

/* GET proposal. */
router.get('/proposal', async function(req, res, next) {
	var id = req.query.id;
	await projects_data.getProposal(id).then(function (proposal) {
		this.proposal = proposal[0];
		console.log(proposal);
	})
  res.render('proposal', {layout: false, proposal: this.proposal});
});

/* GET approve_proposal. */
router.get('/action_proposal', async function(req, res, next) {
	var id = req.query.id;
	var state = req.query.state;
	await projects_data.actionProposal(id, state).then(function (outcome) {
		this.outcome = outcome;
		console.log(outcome);
	})
	res.send("<h3>The project proposal was successfully approved.</h3>");
});

/* GET proposals. */
router.get('/proposals', async function(req, res, next) {
	await projects_data.getAllProposals().then(function (proposals) {
		this.proposals = proposals;
		console.log(proposals);
	})
	var isEmpty;
	if (proposals.length > 0) {
		isEmpty = false;
	} else {
		isEmpty = true;
	}
	console.log(isEmpty);
  res.render('proposals', {layout: false, proposals: this.proposals, isEmpty: this.isEmpty});
});

/* GET view teams. */
router.get('/viewteams', async function(req, res, next) {
  res.render('viewteams', {layout: false});
});

/* GET view team-list. */
router.get('/team-list', async function(req, res, next) {
	await teams_data.getAllTeams(req.query).then(function (team) {
		this.team = team;
		console.log(team);
	})
  res.render('team-list', {layout: false, teams: this.team});
});

/* GET view students. */
router.get('/viewstudents', async function(req, res, next) {
  res.render('viewstudents', {layout: false});
});

/* GET view student-list. */
router.get('/student-list', async function(req, res, next) {
	await students_data.getAllStudents(req.query).then(function (student) {
		this.student = student;
		console.log(student);
	})
  res.render('student-list', {layout: false, students: this.student});
});

/* GET login. */
router.get('/login', async function(req, res, next) {
  res.render('login', {layout: false});
});

/* POST login. */
router.post('/login', async function(req, res, next) {
	await login_data.staffLogin(req.body.useremail, req.body.userpw).then(function (login) {
		this.login = login;
		console.log(login);
	})
	if (login == false) {
		res.render('login', {layout: false, loginFailure: true});
	} else {
		res.redirect('/');
	}

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
  var hash =  crypto.createHmac('sha256', salt); /* Hashing algorithm sha256 */
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
};
