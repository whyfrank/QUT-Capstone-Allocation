//methods for providing security features
var security = require('../utils/security');

//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');
var students_data = require('../data_access/students');

function Register() {

  this.getOptions = async function(){
    return new Promise(function(resolve, reject) {
      connection.init();
      connection.acquire(function (err, con) {
        var options = { sql: 'SELECT DISTINCT course_code FROM students' };
        con.query(options, function (err, results, fields) {
      resolve(results);
      con.release();

            });

      });
    });
  };
  
  this.registrationProcess = async function (req, res, isUpdate) {
	  	console.log(req.body);
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
        password:req.body.password,
		goals:req.body.goals,
		urls:req.body.urls,
		oskills:req.body.oskills,
    }
	
	console.log(student);

  await this.registerStudent(student, isUpdate).then(function (register) {
		this.register = register;
		console.log(register);
    })
    if (register == false) {
		res.render('register', {layout: false, registerFailure: true});
    } else {
		var skillsJson = JSON.parse(req.body.skills);
		await this.registerStudentSkills(skillsJson, student.student_id).then(function (skills) {
			this.skills = skills;
			console.log(skills);
			if (req.file != undefined) {
				students_data.updateStudentProfilePicture(student.student_id, req.file.buffer);
			}
		})
		res.redirect('/login');
    }
  }


  this.registerStudent = async function (student, isUpdate) {
      //CHECK IF EMAIL ALREADY EXISTS
      return new Promise(function(resolve, reject) {
        // initialize database connection
        connection.init();
        // calling acquire methods and passing callback method that will be execute query
        // return response to server
        connection.acquire(function (err, con) {
          var options = { sql: 'SELECT * FROM students WHERE qut_email = ?' };
          con.query(options, [student.qut_email], function (err, results, fields) {


            // Check if a user account has been matched with the QUT email and is registering, not updating.
            if (results.length > 0 && !isUpdate){
              resolve(false);
            } else {
              // ADD STUDENT INTO DATABASE
			  if (!isUpdate) {
				  options = { sql: 'INSERT INTO students (student_id, password, password_salt, first_name, last_name, qut_email, gpa, course_code, course_title, study_area_a, study_area_b, goals, urls, other_skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' };
				  var data = [student.student_id, student.password, "a", student.first_name, student.last_name, student.qut_email, student.gpa, student.course_code, student.course_title, student.study_area_a, student.study_area_b, student.goals, student.urls, student.oskills];
			  } else {
				  options = { sql: 'UPDATE students SET password = ?, password_salt = ?, first_name = ?, last_name = ?, qut_email = ?, gpa = ?, course_code = ?, course_title = ?, study_area_a = ?, study_area_b = ?, goals = ?, urls = ?, other_skills = ?' };
			      var data = [student.password, "a", student.first_name, student.last_name, student.qut_email, student.gpa, student.course_code, student.course_title, student.study_area_a, student.study_area_b, student.goals, student.urls, student.oskills];
			  }
			  
              console.log(options.sql);
			  con.query(options, data, function (error, response) {
                if (error) throw error;
                resolve(true);

				con.release();
              });
            }
        });
      });
    });
  }
  
  	// Set a team for a project.
    this.registerStudentSkills = function (skills, studentId) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				for (var i = 0; i < skills.length; i++) {
					var skill = skills[i];
					var options = { sql: "SELECT * FROM student_skills WHERE student_id = ? AND skill = ?" };
					con.query(options, [studentId, skill], (function(skill){ return function (err, results, fields) {
						console.log(results);
						console.log(results.length);
						if (results.length == 0) {
							console.log(skill);
							var optionsInsert = { sql: "INSERT INTO student_skills (student_id, skill) VALUES (?, ?)" };
							con.query(optionsInsert, [studentId, skill], function (error, response ) {
								console.log(response);
								if (error) throw error;
							});
						}
					};})(skill));
				}
				con.release();
				resolve(true);
			});
		});
	}
};

module.exports = new Register();
