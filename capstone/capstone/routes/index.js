var express = require('express');
var session = require('express-session');
var router = express.Router();
var crypto = require('crypto');
const HtmlEmail = require('html-email');

//custom route for fetching data
var projects_data = require('../data_access/projects');
var teams_data = require('../data_access/teams');
var students_data = require('../data_access/students');
var login_data = require('../data_access/login');
var register_data = require('../data_access/register');

var project_assign = require('../utils/project_assign');
var outlook_auth = require('../utils/outlook_auth');
var outlook_actions = require('../utils/outlook_actions');
var emails = require('../utils/emails');

//Contains User Session data
router.use(session({secret:'XASDASDA', resave: false, saveUninitialized: false}));

/* GET home page. */
router.get('/', function(req, res, next) {
	var session_data = req.session;

	// Check if the user is logged in
	if (session_data.qut_email) {
		res.render('index', { title: 'IT Capstone', page: req.query.page, session_data: session_data});
	} else {
		res.redirect('/login');
	}
});

/* GET view allocation. */
router.get('/allocation', async function(req, res, next) {
    res.render('allocation', {layout: false});
});

/* GET view allocation-list. */
router.get('/allocation-list', async function(req, res, next) {

	// Regenerate allocations if specified
	if (req.query.regenerate != undefined) {
		if (req.query.regenerate == 'true') {
			await project_assign.generateAllocation();
		}
	}

	await project_assign.retrieveAllocation().then(function (allocation) {
		this.allocation = allocation;
	})
  res.render('allocation-list', {layout: false, allocation: this.allocation});
});

/* GET view project-allocation. */
router.get('/project-allocation', async function(req, res, next) {
	// Set default settings for allocation
	var settings = {count: 5, sort: "gpa_skills", strictCourseCombo: false};
	if (req.query.id != undefined) {
		// Set any allocation settings configured by user
		if (req.query.no_of_matches != undefined) {
			settings.count = req.query.no_of_matches;
		}
		if (req.query.strict_coursecombo != undefined) {
			if (req.query.strict_coursecombo === 'true') {
				settings.strictCourseCombo = true;
			}
		}
		if (req.query.sort != undefined) {
			settings.sort = req.query.sort;
		}
		var projectId = req.query.id;
		await project_assign.generateAllocation(projectId, settings).then(function (allocation) {
			this.allocation = allocation;
		})

		res.render('project-allocation', {layout: false, allocation: this.allocation, settings: settings});
	}
});

/* GET allocation finalize */
router.get('/allocation-finalize', async function(req, res, next) {
	var session_data = req.session;
	var isAuthorized = false;
	var isError = true;
	if (req.session.token != undefined) {
		isAuthorized = true;
		await outlook_actions.getUser(req.session.token).then(function (user) {
			this.outlookUser = user;
			console.log(outlookUser);
		})
		console.log(outlookUser);
	}
	var outlook_authenticate = await outlook_auth.getAuthUrl();
	if (req.query.projectId != undefined) {
		await projects_data.getProject(req.query.projectId).then(function (project) {
			this.project = project[0];
		})
		if (req.query.teamId != undefined) {
			await teams_data.getTeam(req.query.teamId).then(function (team) {
				this.team = team[0];
				console.log(team);
			})

			this.teamEmail = await emails.generateTeamEmail(project.project_name + " - " + project.company_name, team.team_name);
			this.partnerEmail = await emails.generatePartnerEmail();
		}
	}

	res.render('allocation-finalize', {layout: false, isAuthorized: isAuthorized, outlook_authenticate: outlook_authenticate,
				project: project, team: team, outlookUser: this.outlookUser, teamEmail: this.teamEmail, partnerEmail: this.partnerEmail});
});

/* GET preview student email. */

router.post('/allocation-finalize', async function(req, res, next) {
	this.token = req.session.token;
	this.teamBody = req.body.teamBody;
	this.teamSubject = req.body.teamSubject;
	this.teamImportance = req.body.teamImportance;
	this.userEmail = req.body.userEmail;
	this.isSuccessful = true; //TODO: Check with actual values
	
	await teams_data.getTeam(req.body.teamId).then(function (team) {
		this.team = team[0];
	})
	await projects_data.getProject(req.body.projectId).then(function (project) {
		this.project = project[0];
	})
	var students = this.team.students_in_teams;
	var teamEmails = [];
	
	for (var i = 0; i < students.length; i++) {
		teamEmails.push(students[i].students.qut_email);
		console.log(teamEmails[i]);
	}
	
	var result = await outlook_actions.sendMail(token, teamSubject, teamImportance, teamBody, teamEmails, userEmail);
	
	projects_data.allocateProject(team.team_id, project.project_id);
	res.render('allocation-finalized', {layout: false, project: project, team: team, isSuccessful, isSuccessful});

router.get('/student-email-preview', async function(req, res, next) {
	var email = new HtmlEmail('teams-projectallocation', 'en');
	var emailBody = email.body({
						team_name: req.query.team_name
					});

    res.send(emailBody);
});


var projects;

/* GET office authorize. */
router.get('/officeauthorize', async function(req, res, next) {
	var session_data = req.session;
	var code = req.query.code;

	var token = await outlook_auth.getTokenFromCode(code);
	session_data.token = token.token.access_token;

    res.send('<head><title>Authorized</title></head><body>You may now close this window.</body>');
});

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

/* GET view my team. */
router.get('/viewmyteam', async function(req, res, next) {
  res.render('viewmyteam', {layout: false});
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
	var session_data = req.session;

	if(session_data.qut_email) {
		res.redirect('/');
	}
	res.render('login', {layout: false});
});

/* POST login. */
router.post('/login', async function(req, res, next) {
	var session_data = req.session;

	if (req.body.account_type == "staff"){
		await login_data.staffLogin(req.body.useremail, req.body.userpw).then(function (login) {
			this.login = login;
			console.log(login);
		})
		if (login == false) {
			res.render('login', {layout: false, loginFailure: true, accountType: req.body.account_type, email: req.body.useremail});
		} else {
			session_data.qut_email = login.qut_email;
			session_data.first_name = login.First_name;
			session_data.last_name = login.last_name;
			session_data.staff_type = login.staff_type;

			res.redirect('/');
		}

	} else if (req.body.account_type == "student"){
		await login_data.studentLogin(req.body.useremail, req.body.userpw).then(function (login) {
			this.login = login;
			console.log(login);
		})
		if (login == false) {
			res.render('login', {layout: false, loginFailure: true, accountType: req.body.account_type, email: req.body.useremail});
		} else {
			session_data.qut_email = login.qut_email;
			session_data.first_name = login.First_name;
			session_data.last_name = login.last_name;

			res.redirect('/');
		}
	}




});

/* GET logout. */
router.get('/logout', function(req, res, next) {
	var session_data = req.session;

	// Check if the user is logged in before attempting to destory session.
	if(session_data.qut_email) {
		req.session.destroy();
	}
	res.redirect('/login');
});

/* GET Register. */
router.get('/register', async function(req, res, next) {

	await register_data.getOptions().then(function (options) {
		this.options = options;
		console.log(options);
	})

  res.render('register', {layout: false, dropdownVals: this.options});
});

/* POST Register. */
router.post('/register', async function(req, res, next) {
  var today = new Date();
  var student={
        first_name:req.body.firstname,
        last_name:req.body.lastname,
        qut_email:req.body.useremail,
        gpa:req.body.gpa,
        course_code:req.body.coursecode,
        course_title:req.body.coursetitle,
        study_area_a:req.body.studyareaa,
        study_area_b:req.body.studyareab,
        student_id:req.body.studentid,
        password:req.body.password
    }

  await register_data.registerStudent(student).then(function (register) {
      this.register = register;
      console.log(register);
    })
    if (register == false) {
      res.render('register', {layout: false, registerFailure: true});
    } else {
      res.redirect('/login');
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
