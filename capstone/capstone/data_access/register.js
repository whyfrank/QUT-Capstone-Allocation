//methods for providing security features
var security = require('../utils/security');

//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

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


  this.registerStudent = async function (student) {

      //CHECK IF EMAIL ALREADY EXISTS
      return new Promise(function(resolve, reject) {
        // initialize database connection
        connection.init();
        // calling acquire methods and passing callback method that will be execute query
        // return response to server
        connection.acquire(function (err, con) {
          var options = { sql: 'SELECT * FROM students WHERE qut_email = ?' };
          con.query(options, [student.qut_email], function (err, results, fields) {


            // Check if a user account has been matched with the QUT email.
            if (results.length > 0){
              resolve(false);
            } else {
              // ADD STUDENT INTO DATABASE
			  options = { sql: 'INSERT INTO students (student_id, password, password_salt, first_name, last_name, qut_email, gpa, course_code, course_title, study_area_a, study_area_b, goals, urls, other_skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' };
              con.query(options, [student.student_id, student.password, "a", student.first_name, student.last_name, student.qut_email, student.gpa, student.course_code, student.course_title, student.study_area_a, student.study_area_b, student.goals, student.urls, student.oskills], function (error, response) {
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
				var options = { sql: "INSERT IGNORE INTO student_skills (student_id, skill) VALUES (?, ?)", nestTables: true };
				for (var i = 0; i < skills.length; i++) {
					con.query(options, [studentId, skills[i]], function (err, results, fields) {

					});
				}
				con.release();
				resolve(true);
			});
		});
	}
};

module.exports = new Register();
