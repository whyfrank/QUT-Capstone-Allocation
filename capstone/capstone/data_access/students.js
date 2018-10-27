//methods for fetching mysql data
var connection = require('../connection/db');
var fs  = require('fs');
var capstone_config = require('../configuration/CapstoneConfiguration');
const sharp = require('sharp');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Students() {

    // get all users data
    this.getAllStudents = function (query, isExport) {

			var appendedFilters = " ";
			var selectWildcard = "*";
			var statusFilter = " ";
			if (query.query != null) {
				appendedFilters = appendedFilters + "WHERE students.first_name LIKE '%" + query.query + "%'";
			}

			if(query.joinedStatus ==1){
				statusFilter = "WHERE students.student_id = Students_in_teams.student_id";
			}

			if(query.notJoinedStatus ==1){
				statusFilter = "WHERE students_in_teams.student_id IS NULL";
			}
			
			if (isExport != undefined) {
				if (isExport) {
					selectWildcard = "student_id, first_name, last_name, qut_email, gpa, course_code, course_title, study_area_a, study_area_b, phone";
				}
			}

		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
        var options = { sql: 'SELECT ' + selectWildcard + ' FROM students LEFT JOIN students_in_teams ON students_in_teams.student_id = students.student_id LEFT JOIN team ON students_in_teams.team_id = team.team_id' + appendedFilters + statusFilter, nestTables: true };
				con.query(options, function (err, results, fields) {
					var nestingOptions = [
						{ tableName : 'students', pkey: 'student_id'},
						{ tableName : 'students_in_teams', pkey: 'student_id', fkeys:[{table:'team',col:'team_id'},{table:'student',col:'student_id'}]},
						{ tableName : 'team', pkey: 'team_id'}
					];
					var nestedResults = mysql_nest.convertToNested(results, nestingOptions);
					if (err) { console.log(err) }
					con.release();
					resolve(results);
				});
			});
		});
    };
	
	// Get a student's data
    this.getStudent = function (student_id) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
        var options = { sql: 'SELECT * FROM students LEFT JOIN student_skills ON students.student_id = student_skills.student_id WHERE students.student_id = ?', nestTables: true};
				con.query(options, [student_id], function (err, results, fields) {
					    var nestingOptions = [
							{ tableName : 'students', pkey: 'student_id'},
							{ tableName : 'student_skills', pkey: 'id', fkeys:[{table:'skills',col:'skill_id'},{table:'students',col:'student_id'}]}
						];
						var nestedResults = mysql_nest.convertToNested(results, nestingOptions);
					con.release();
					var student = results[0].students;
					student.urls = JSON.parse(student.urls);
					console.log(student.other_skills.length);
					if (student.urls.length < 1) {
						delete student.urls;
					}
					student.other_skills = JSON.parse(student.other_skills);
					if (student.other_skills.length < 1) {
						delete student.other_skills;
					}
					resolve(student);
				});
			});
		});
    };

    // Will add a student to a team, but set their approval state as false.
    this.requestJoinTeam = function(student_id, team_id){
      return new Promise(function(resolve, reject) {
        connection.init();
        connection.acquire(function (err, con) {
          var options = { sql: 'INSERT INTO students_in_teams (student_id, team_id, master, is_approved) VALUES (?, ?, 0, 0)' };
          con.query(options, [student_id, team_id], function (err, results, fields) {
          resolve(results[0]);
          con.release();
          });
        });
      });
    }
	
	    // Will add a student to a team, but set their approval state as false.
    this.addMasterToTeam = function(student_id, team_id){
      return new Promise(function(resolve, reject) {
        connection.init();
        connection.acquire(function (err, con) {
          var options = { sql: 'INSERT INTO students_in_teams (student_id, team_id, master, is_approved) VALUES (?, ?, 1, 1)' };
          con.query(options, [student_id, team_id], function (err, results, fields) {
			  resolve(results[0]);
			  con.release();
          });
        });
      });
    }

	// Will remove a student from a team. The team ID is there to check if the student who is being removed, is
	// actually a part of their team, to avoid any malicious attempts to remove a student from another team.
    this.removeStudentFromTeam = function(student_id, team_id){
      return new Promise(function(resolve, reject) {
        connection.init();
        connection.acquire(function (err, con) {
          var options = { sql: 'DELETE FROM students_in_teams WHERE student_id = ? AND team_id = ?' };
          con.query(options, [student_id, team_id], function (err, results, fields) {
          resolve();
          con.release();
          });
        });
      });
    }
	
	this.updateStudentProfilePicture = async function(student_id, imageBuffer) {
		await sharp(imageBuffer)
		    .resize(300, 300, {fit: sharp.fit.inside})
		    .toFile(capstone_config.PROFILEPICTURE_DIR + student_id + '.jpg');
	}
	
}

module.exports = new Students();
