var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mysql_nesting = require('node-mysql-nesting');
var multer = require('multer');

var capstoneConfiguration = require('./configuration/CapstoneConfiguration');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

var fs = require('fs');

var hbs = require('hbs');
var helpers = require('handlebars-helpers')();
const upload = multer({ dest: capstoneConfiguration.PROFILEPICTURE_DIR }); // multer configuration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var session = require('express-session');


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

hbs.registerHelper('test', function(variable,context){
	return new hbs.SafeString(variable);
});

// A helper used to determine if a team should be visible within a team-list, in regards to teams
// that students should NOT be able to register into.
hbs.registerHelper('teamVisible', function(team, staff_type, context){
	// If the user is a student, and this team has more than 3 members, then do not display the team.
	if (team.students_in_teams.length >= capstoneConfiguration.MAX_STUDENTS_PER_TEAM && staff_type == "student") {
		return context.inverse(this);
	} else {
		return context.fn(this);
	}
});

hbs.registerHelper('studentProfilePictureUploaded', function(student_id, context){
	// If an image is located for the particular student, then return true.
	if (fs.existsSync(capstoneConfiguration.PROFILEPICTURE_DIR + student_id + '.jpg')) {
		return context.fn(this);
	} else {
		return context.inverse(this);
	}
});

// A helper used to ge the URL for the profile picture of a particular student.
hbs.registerHelper('studentProfilePicture', function(student_id, context) {
	return new hbs.SafeString(capstoneConfiguration.PROFILEPICTURE_PUBLIC_DIR + student_id + '.jpg');
});

// A helper used to deserialize a JSON string
hbs.registerHelper('deserialize', function(input, context) {
	var results = '';
	var data = JSON.parse(input);
	data.forEach((item) => {
		results += context.fn(item);
	});
	return results;
});

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

//Sets various codes for displaying a project milestone, depending on multiple factors of the
//current allocation progress for a project.
hbs.registerHelper('project_milestone', function(project,context){
	// Check if not assigned
	if (project.allocated_team == null) {
		return new hbs.SafeString('NA');
	}
	// Assigned
	else if(project.final_allocation == 1) {
		return new hbs.SafeString('A');
	}
	// Declined Assignment
	else if (project.partner_accepted == 'Declined' || project.team_accepted == 'Declined') {
		return new hbs.SafeString('DA');
	}
	// Preliminary Assignment
	else if (project.partner_accepted == 'Approved' && project.team_accepted == 'Approved') {
		return new hbs.SafeString('PA');
	}
	// Awaiting industry partner acceptance
	else if (project.partner_accepted == 'Pending') {
		return new hbs.SafeString('AP');
	}
	// Awaiting team acceptance
	else if (project.team_accepted == 'Pending') {
		return new hbs.SafeString('AT');
	}
	// If none of the above conditions have been met, display an 'E' for error.
	return new hbs.SafeString('E');
});

module.exports = app;
