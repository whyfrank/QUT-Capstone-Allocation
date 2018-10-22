//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Teams() {

var joinSql = " LEFT JOIN ";
var teamSql = "SELECT * FROM team";
var inTeamsSql = "students_in_teams ON team.team_id = students_in_teams.team_id";
var skillsSql = "student_skills ON students_in_teams.student_id = student_skills.student_id";

    // get all teams data
    this.getAllTeams = function (query, isStudent, includeRequests) {
		var inTeamSql = "AND students_in_teams.is_approved = 1";
		if (includeRequests) {
			inTeamSql = "";
		}
		
		var hasQuery = true;
		if (query == undefined) {
			hasQuery = false;
		}

		var appendedFilters = " ";
		var statusFilter = " ";
		if (hasQuery) {
			if (query.query != null) {
				appendedFilters = appendedFilters + " AND team.team_name LIKE '%" + query.query + "%'";
			}
			if(query.readyStatus ==1){
			  statusFilter = " AND team.team_ready = 1";
			}

			if((query.notReadyStatus ==1) || isStudent){
			  statusFilter = " AND team.team_ready = 0";
			}
		}

		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: 'SELECT * FROM team LEFT JOIN students_in_teams ON team.team_id = students_in_teams.team_id ' + inTeamSql + ' LEFT JOIN students ON students_in_teams.student_id = students.student_id' + joinSql + skillsSql + appendedFilters + statusFilter, nestTables: true };
				console.log (options.sql);
				con.query(options, function (err, results, fields) {
					    var nestingOptions = [
							{ tableName : 'team', pkey: 'team_id'},
							{ tableName : 'students_in_teams', pkey: 'student_id', fkeys:[{table:'team',col:'team_id'},{table:'students',col:'student_id'}]},
							{ tableName : 'students', pkey: 'student_id'},
							{ tableName : 'student_skills', pkey: 'id', fkeys:[{table:'skills',col:'skill_id'},{table:'students',col:'student_id'}]}
						];
						var nestedResults = mysql_nest.convertToNested(results, nestingOptions);
					con.release();
					resolve(nestedResults);
				});
			});
		});
	};

	// get team's data
	this.getTeam = function (id, includeRequests) {
		return new Promise(function(resolve, reject) {
			var inTeamSql = " AND students_in_teams.is_approved = 1";
			if (includeRequests) {
				inTeamSql = "";
			}
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: teamSql + joinSql + inTeamsSql + joinSql + "students ON students_in_teams.student_id = students.student_id" + joinSql + skillsSql + "  WHERE team.team_id = ?" + inTeamSql, nestTables: true };
				console.log(options.sql);
				con.query(options, [id],function (err, results, fields) {
						var nestingOptions = [
							{ tableName : 'team', pkey: 'team_id'},
							{ tableName : 'students_in_teams', pkey: 'student_id', fkeys:[{table:'team',col:'team_id'},{table:'students',col:'student_id'}]},
							{ tableName : 'students', pkey: 'student_id'},
							{ tableName : 'student_skills', pkey: 'id', fkeys:[{table:'skills',col:'skill_id'},{table:'student_id_for_skills',col:'student_id'}]}
						];
						var nestedResults = mysql_nest.convertToNested(results, nestingOptions);
					con.release();
					resolve(nestedResults);
				});
			});
		});
    };

		// get team ID from a team a student has joined
	this.getStudentTeam = function (student_id) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: "SELECT * FROM students_in_teams WHERE student_id = ?" };
				con.query(options, [student_id],function (err, results, fields) {
					con.release();
					resolve(results[0]);
				});
			});
		});
    };
	
	this.actionJoinRequest = function (student, isApproved, teamId) {
		
		var state = -1;
		if (isApproved == 'true') {
			state = 1;
		}
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: "UPDATE students_in_teams SET is_approved = ? WHERE student_id = ? AND team_id = ?", nestTables: true };
				con.query(options, [state, student, teamId], function (err, results, fields) {
					con.release();
					resolve(true);
				});
			});
		});
    };

  this.registerTeam = async function (teamData, isUpdate) {
	  //CHECK IF EMAIL ALREADY EXISTS
	  return new Promise(function(resolve, reject) {
		  
		// Correct team_ready data
		if (teamData.team_ready == 'true') {
			teamData.team_ready = 1;
		} else {
			teamData.team_ready = 0;
		}
		// initialize database connection
		connection.init();
		// calling acquire methods and passing callback method that will be execute query
		// return response to server
		connection.acquire(function (err, con) {
		  var options = { sql: 'SELECT * FROM team WHERE team_name = ?' };
		  con.query(options, [teamData.team_name], function (err, results, fields) {
			// Check if a team has been matched with the team name and is registering, not updating.
			if (results.length > 0 && !isUpdate){
			  resolve(false);
			} else {
			  // ADD TEAM INTO DATABASE
			  if (!isUpdate) {
				  options = { sql: 'INSERT INTO team (team_name, team_ready, team_summary, preferred_industry) VALUES (?, ?, ?, ?)' };
				  var data = [teamData.team_name, teamData.team_ready, teamData.team_summary, teamData.preferred_industry];
				  
			// If the team has been updated, ensure that this team is of the same ID.
			  } else if (teamData.team_id == results[0].team_id){
				  options = { sql: 'UPDATE staff SET team_name = ?, team_ready = ?, team_summary = ?, preferred_industry = ? WHERE team_name = ?' };
				  var data = [teamData.team_name, teamData.team_ready, teamData.team_summary, teamData.preferred_industry, teamData.team_name];
			  } else {
				  resolve(false);
			  }
			  console.log(options.sql);
			  con.query(options, data, function (error, results) {
				if (error) {resolve(false); console.log(error)};
				var options = { sql: 'SELECT * FROM team WHERE team_name = ?' };
				con.query(options, [teamData.team_name], function (err, res) {
					resolve(res[0]);
					console.log(res[0]);
				});


				con.release();
			  });
			}
		});
	  });
	});
  }
}

module.exports = new Teams();
