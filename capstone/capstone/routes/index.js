var express = require('express');
var session = require('express-session');
var router = express.Router();
var crypto = require('crypto');
const HtmlEmail = require('html-email');
var multer = require('multer');
var csv_export=require('csv-export');

//custom route for fetching data
var projects_data = require('../data_access/projects');
var teams_data = require('../data_access/teams');
var students_data = require('../data_access/students');
var login_data = require('../data_access/login');
var register_data = require('../data_access/register');
var proposal_data = require('../data_access/industryproposal');
var skills_data = require('../data_access/skills');

var capstone_config = require('../configuration/CapstoneConfiguration');

var storage = multer.memoryStorage()
const upload = multer({ storage: storage }); // multer configuration

var project_assign = require('../utils/project_assign');
var outlook_auth = require('../utils/outlook_auth');
var outlook_actions = require('../utils/outlook_actions');
var emails = require('../utils/emails');
var security = require('../utils/security');

//Contains User Session data
router.use(session({secret:'XASDASDA', resave: false, saveUninitialized: false}));

/* GET home page. */
router.get('/', async function(req, res, next) {
	var session_data = req.session;

	// Check if the user is logged in
	if (session_data.qut_email) {
		res.render('index', { title: 'IT Capstone', page: req.query.page, session_data: session_data});
	} else {
		res.redirect('/login');
	}
});

/* GET action-project page. */
router.get('/action-project', async function(req, res, next) {
	var session_data = req.session;
	var isAccept = "false";
	if (req.query.is_accept == "true") {
		isAccept = "true";
	}
	await projects_data.getTeamProject(session_data.in_team).then(function (project) {
		this.project = project[0];
		console.log(project);
	})

	await projects_data.actionProject(project.project_id, isAccept, session_data.staff_type).then(function (outcome) {
		this.outcome = outcome;
		console.log(outcome);
	})

	res.redirect('/viewmyteam');
});

/* GET action-joinrequest page. */
router.get('/action-joinrequest', async function(req, res, next) {
	var session_data = req.session;
	var isAccept = "false";
	if (req.query.is_accept == "true") {
		isAccept = "true";
	}
	if (req.query.student != undefined) {
		student = req.query.student;
	}

	await teams_data.actionJoinRequest(student, isAccept, session_data.in_team).then(function (outcome) {
		this.outcome = outcome;
		console.log(outcome);
	})

	res.redirect('/viewmyteam');
});

/* GET cancelRequest page. */
router.get('/cancelRequest', async function(req, res, next) {
	var session_data = req.session;

	await students_data.removeStudentFromTeam(session_data.student_id, session_data.in_team).then(function (outcome) {
		this.outcome = outcome;
		console.log(outcome);
	})

	session_data.in_team == false;

	res.redirect('/');
});


/* GET view team CV. */
router.get('/teamcv', async function(req, res, next) {
	await teams_data.getTeam(req.query.id).then(function (team) {
		this.team = team[0];
		console.log(team);
	})

    res.render('teamcv', {layout: false, team: this.team});
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
	var settings = {count: 5, sort: "skills", strictCourseCombo: false};
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
			await teams_data.getTeam(req.query.teamId, false).then(function (team) {
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

	await teams_data.getTeam(req.body.teamId, false).then(function (team) {
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
});

/* GET preview student email. */

router.get('/deallocation-finalize', async function(req, res, next) {
	var session_data = req.session;
	var project_id = req.query.project_id
	if (session_data.staff_type != "staff") {
		res.status(403);
		res.send();
	} else {
		projects_data.deallocateProject(project_id);
		res.redirect('/viewprojects');
	}
});



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

/* GET request finalize project. */
router.get('/finalize-project', async function(req, res, next) {
	var session_data = req.session;
	var id = req.query.id;

	await projects_data.finalizeAllocation(id).then(function (result) {
		this.result = result;
		console.log(result);
	})
  res.redirect('/project-list');
});

/* GET view project. */
router.get('/project', async function(req, res, next) {
	var session_data = req.session;
	if (req.session.staff_type == "staff") {
		this.id = req.query.id;

		await projects_data.getProject(this.id).then(function (project) {
			this.project = project[0];
			console.log(project);
		})
	} else {
		await teams_data.getStudentTeam(session_data.student_id, true).then(function (inTeam) {
			this.inTeam = inTeam;
			console.log(this.inTeam);
		})

		if (this.inTeam.is_approved != 1) {
			res.render('team-approval-pending', {layout: false, session_data: session_data, team: this.team});
			return;
		} else {
			await projects_data.getTeamProject(session_data.in_team).then(function (project) {
				this.project = project[0];
				console.log(project);
			})
		}
	}

  res.render('project', {layout: false, project: this.project, session_data: session_data});
});

/* GET proposals. */
router.get('/proposals', async function(req, res, next) {
	var session_data = req.session;
	console.log(session_data.staff_type);

	await projects_data.getAllProposals(session_data.staff_type).then(function (proposals) {
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

/* GET proposal. */
router.get('/proposal', async function(req, res, next) {
	var id = req.query.id;
	await projects_data.getProposal(id).then(function (proposal) {
		this.proposal = proposal[0];
		console.log(proposal);
	})

	await proposal_data.checkUpdatedDetails(id).then(function (results){
		this.results = results;
	})

	await proposal_data.getDifficulty().then(function (difficulty){
		this.difficulty = difficulty;
	})

	await proposal_data.getPriority().then(function (priority){
		this.priority = priority;
	})

	await proposal_data.getPreferredCourseCombination().then(function (coursecombo){
		this.coursecombo = coursecombo;
		console.log(coursecombo);
	})

	var bool;
	if (results.length > 0) {
		bool = true;
	} else {
		bool = false;
	}
	console.log(bool)

	var session_data = req.session;
	if (session_data.staff_type == "industry"){
		res.render('proposal', {layout: false, proposal: this.proposal, bool: this.bool});
	} else if (session_data.staff_type == "staff"){
		res.render('staffUpdateProposal', {layout: false, proposal: this.proposal, difficulty: this.difficulty, priority: this.priority, coursecombo: this.coursecombo});
	}
});

/* GET approve_proposal. */
router.get('/action_proposal', async function(req, res, next) {
	var session_data = req.session;
	var id = req.query.id;
	var state = req.query.state;

	// var proposal={
  //       // company_name:req.body.companyname,
	//
  //   }

	// if staff type is staff
	// then take the fields from the form and pass to new function
	// called updateProjectDetails

	await projects_data.actionProject(id, state, session_data.staff_type).then(function (outcome) {
		this.outcome = outcome;
		console.log(outcome);
	})
	res.send("<h3>The project proposal was successfully approved.</h3>");
});


/* GET Industry Partner Contact Details. */
router.get('/industrycontacts', async function(req, res, next) {
	await proposal_data.getAllPendingPartners().then(function (partners) {
		this.partners = partners;
		console.log(partners);
	})

	var isEmpty;
	if (partners.length > 0) {
		isEmpty = false;
	} else {
		isEmpty = true;
	}
	console.log(isEmpty);
  res.render('industrycontacts', {layout: false, partners: this.partners, isEmpty: this.isEmpty});

});

var id;
/* GET Industry Contact. */
router.get('/industrycontact', async function(req, res, next) {
	id = req.query.id;
	await proposal_data.getProject(id).then(function (project) {
		this.project = project;
		console.log(project);
	})

  res.render('industrycontact', {layout: false, project: this.project});
});

/* POST Industry Contact. */
router.post('/industrycontact', async function(req, res, next) {
	// var id = req.body.project_id;
	var details={
				first_name:req.body.first_name,
				last_name:req.body.last_name,
				phone:req.body.phone,
				email:req.body.email
		}

  await proposal_data.updateDetails(id, details).then(function (submit) {
      this.submit = submit;
      console.log(submit);
    })
    if (submit == false) {
      res.render('industrycontact', {layout: false, submitFailure: true});
    } else {
      res.redirect('/');
    }


  res.render('industrycontact', {layout: false, proposal: this.proposal});
});

/* GET view teams. */
router.get('/viewteams', async function(req, res, next) {
	var session_data = req.session;

  res.render('viewteams', {layout: false, session_data: session_data});
});

/* GET view teams. */
router.get('/team-approval-pending', async function(req, res, next) {
	var session_data = req.session;
  res.render('team-approval-pending', {layout: false, session_data: session_data});
});

/* GET request join team. */
router.get('/jointeam', async function(req, res, next) {
	var session_data = req.session;
	var team_id = req.query.team_id;
	session_data.in_team = team_id;

	await students_data.requestJoinTeam(session_data.student_id, team_id).then(function (result) {
		this.result = result;
		console.log(result);
	})
  res.redirect('/');
});

/* GET view my team. */
router.get('/viewmyteam', async function(req, res, next) {
	var session_data = req.session;

	await teams_data.getTeam(session_data.in_team, true).then(function (team) {
		this.team = team[0];
		console.log(team);
	})

	await teams_data.getStudentTeam(session_data.student_id, true).then(function (inTeam) {
		this.inTeam = inTeam;
		console.log(this.inTeam);
	})

	this.project;
	await projects_data.getAllProjects().then(function (projects) {
		for (var i = 0; i < projects.length; i++) {
			console.log(projects);
			if (this.team.team_id == projects[i].allocated_team) {
				this.project = projects[i];
				console.log(this.project);
			}
		}
	})
	if (inTeam != undefined) {
		// If the student hasn't been accepted into the team, do not display team info.
		if (inTeam.is_approved == 0) {
			res.render('team-approval-pending', {layout: false, session_data: session_data, team: this.team});
		} else if (inTeam.is_approved == -1) {
			await students_data.removeStudentFromTeam(session_data.student_id, session_data.in_team);
			session_data.in_team = false;
			res.render('team-approval-rejected', {layout: false, session_data: session_data, team: this.team});
		} else {
			res.render('viewmyteam', {layout: false, team: this.team, project: this.project});
		}
	} else {
		res.redirect('/');
	}
});

/* GET edit my team. */
router.get('/editteam', async function(req, res, next) {
	var session_data = req.session;
	var isNewTeam = false;
	var inATeam = null;
	await teams_data.getTeam(session_data.in_team, true).then(function (team) {
		this.team = team[0];
		if (this.team == undefined) {
			isNewTeam = true;
		}
		console.log(this.team);
	})
	if (!isNewTeam) {
		await teams_data.getStudentTeam(session_data.student_id, true).then(function (inTeam) {
			inATeam = inTeam;
			console.log(inATeam);
		})
	}

	if (inATeam != null) {
		if (inTeam.is_approved == -1) {
			await students_data.removeStudentFromTeam(session_data.student_id, session_data.in_team);
			session_data.in_team = false;
		}
		else if (!isNewTeam && inTeam.is_approved == 0) {
			res.render('team-approval-pending', {layout: false, session_data: session_data, team: this.team});
		} else {
			res.render('editteam', {layout: false, team: this.team, isNewTeam: isNewTeam, inTeam: this.inTeam});
		}
	}
  	// If the student hasn't been accepted into the team, do not display team info.
	else {
		res.render('editteam', {layout: false, team: this.team, isNewTeam: isNewTeam, inTeam: this.inTeam});
	}
});

router.post('/editteam', async function(req, res, next) {
	var session_data = req.session;
	var teamData = {
		team_name: req.body.team_name,
		team_summary: req.body.team_summary,
		preferred_industry: req.body.preferred_industry,
		team_ready: req.body.team_ready,
		team_id: session_data.in_team,
	}
	
	
	await teams_data.registerTeam(teamData, true).then(function (team) {
		this.team = team;
		console.log(this.team);
	})
	res.redirect('/');
});

router.post('/createteam', async function(req, res, next) {
	var session_data = req.session;
	var teamData = {
		team_name: req.body.team_name,
		team_summary: req.body.team_summary,
		preferred_industry: req.body.preferred_industry,
		team_ready: 'false',
	}
	
	await teams_data.registerTeam(teamData, false).then(function (team) {
		this.team = team;
		console.log(this.team);
	})
	
	console.log(this.team.team_id + " " + session_data.student_id);
	await students_data.addMasterToTeam(session_data.student_id, this.team.team_id );
	
	session_data.in_team = this.team.team_id;
	session_data.team_approved = 1;
	res.redirect('/');
});

/* GET view team-list. */
router.get('/team-list', async function(req, res, next) {
	var session_data = req.session;
	isStudent = false;
	this.team = false;
	if (session_data.staff_type == 'student') {
		isStudent = true;
		this.joinTeamEnabled = true;
		if (session_data.in_team != false) {
			await teams_data.getStudentTeam(session_data.student_id, true).then(function (inTeam) {
				this.inTeam = inTeam;
				console.log(this.inTeam);
				if (inTeam.is_approved == 0) {
					this.joinTeamEnabled = false;
				}
			})

			await teams_data.getTeam(inTeam.team_id, true).then(function (team) {
				this.team = team[0];
				console.log(this.team);
			})
		}
	}
	await teams_data.getAllTeams(req.query, isStudent, false).then(function (teams) {
		this.teams = teams;
		console.log(teams);
	})
	
	// If export has been specified, send a .zip file with the CSV export of team data.
	if (req.query.export != undefined) {
		csv_export.export(this.teams,function(buffer){
			res.header("Content-Type", "application/zip");
			res.send(buffer);
		});
	} else {
		if (session_data.staff_type == 'student') {
			res.render('team-list', {layout: false, teams: this.teams, session_data: session_data, joinTeamEnabled: this.joinTeamEnabled, inTeam: this.inTeam, team: this.team});
		} else {
			res.render('team-list', {layout: false, teams: this.teams, session_data: session_data});
		}
	}  
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
	
	// If export has been specified, send a .zip file with the CSV export of student data.
	if (req.query.export != undefined) {
		// Strip unnecessary data
		for (var i = 0; i < this.student.length; i++) {
			delete this.student[i].students.urls;
			delete this.student[i].students.other_skills;
			delete this.student[i].students.password;
			delete this.student[i].students.password_salt;
			delete this.student[i].students.goals;
			delete this.student[i].team.team_summary;
			delete this.student[i].team.preferred_industry;
		}
		csv_export.export(this.student,function(buffer){
			res.header("Content-Type", "application/zip");
			res.send(buffer);
		});
	} else {
		res.render('student-list', {layout: false, students: this.student});
	}
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
			session_data.first_name = login.first_name;
			session_data.last_name = login.last_name;

			if (login.staff_type == "Industry Liason"){
				session_data.staff_type = "industry";
			} else {
				session_data.staff_type = "staff";
			}
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
			await teams_data.getStudentTeam(login.student_id).then(function (team) {
				if (team != undefined) {
					session_data.in_team = team.team_id;
					session_data.team_approved = team.is_approved;
				} else {
					session_data.in_team = false;
					session_data.team_approved = false;
				}
			})
			session_data.qut_email = login.qut_email;
			session_data.first_name = login.First_name;
			session_data.last_name = login.last_name;
			session_data.student_id = login.student_id;
			session_data.staff_type = "student"
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
	await skills_data.getSkills().then(function (skills) {
		this.skills = skills;
		console.log(skills);
	})

	await skills_data.getSkillCategories().then(function (skillCategories) {
		this.skillCategories = skillCategories;
		console.log(skillCategories);
	})

	// DEPRECATED
	await register_data.getOptions().then(function (options) {
		this.options = options;
		console.log(options);
	})

  res.render('register', {layout: false, dropdownVals: this.options, config: capstone_config, skills: this.skills, skillCategories: this.skillCategories});
});

/* POST Register. */
router.post('/register', upload.single('profilepicture'), async function(req, res, next) {
	register_data.registrationProcess(req, res, false);
});

/* POST updateaccount. */
router.post('/updateaccount', upload.single('profilepicture'), async function(req, res, next) {
	var session_data = req.session;
	register_data.registrationProcess(req, res, true, session_data);
});

/* GET Update Account. */
router.get('/updateaccount', async function(req, res, next) {
	var session_data = req.session;
	isStudent = false;
	if (session_data.staff_type == 'student') {
		await skills_data.getSkills().then(function (skills) {
			this.skills = skills;
			console.log(skills);
		})
		
		await skills_data.getSkillCategories().then(function (skillCategories) {
			this.skillCategories = skillCategories;
			console.log(skillCategories);
		})
		
		await students_data.getStudent(req.session.student_id).then(function (student) {
			this.student = student;
			console.log(student);
		})
	
		res.render('register', {layout: false, dropdownVals: this.options, config: capstone_config, 
			skills: this.skills, skillCategories: this.skillCategories, update: true, student: this.student});
	}
});

/* GET Register staff. */
router.get('/registerstaff', async function(req, res, next) {

  res.render('registerstaff', {layout: false, config: capstone_config});
});

/* POST Register staff. */
router.post('/registerstaff', async function(req, res, next) {
	register_data.registrationStaffProcess(req, res, false);
});

/* GET update staff. */
router.get('/updatestaffaccount', async function(req, res, next) {
	var session_data = req.session;
  res.render('registerstaff', {layout: false, config: capstone_config, update: true, staff: session_data});
});

/* POST update staff. */
router.post('/updatestaffaccount', async function(req, res, next) {
	register_data.registrationStaffProcess(req, res, true);
});


/* GET Industry Project Proposal Form. */
router.get('/industryproposal', async function(req, res, next) {

	res.render('industryproposal', {layout: false});

});

/* POST Industry Project Proposal Form. */
router.post('/industryproposal', async function(req, res, next) {
  var proposal={
        company_name:req.body.companyname,
        project_name:req.body.projectname,
        industry:req.body.industry,
        description:req.body.description
    }

  await proposal_data.submitProposal(proposal).then(function (submit) {
      this.submit = submit;
      console.log(submit);
    })
    if (submit == false) {
      res.render('industryproposal', {layout: false, submitFailure: true});
    } else {
      res.redirect('/');
    }
});





module.exports = router;