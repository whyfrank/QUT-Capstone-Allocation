//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Teams() {

    // get all users data
    this.getAllTeams = function (query) {

		var appendedFilters = " ";
		var statusFilter = " ";
		if (query.query != null) {
			appendedFilters = appendedFilters + "WHERE team.team_name LIKE '%" + query.query + "%'";
		}
	
		if(query.readyStatus ==1){
		  statusFilter = "WHERE team.team_ready = 1";
		}
	
		if(query.notReadyStatus ==1){
		  statusFilter = "WHERE team.team_ready = 0";
		}

		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: 'SELECT * FROM team LEFT JOIN students_in_teams ON team.team_id = students_in_teams.team_id LEFT JOIN students AS student ON students_in_teams.student_id = student.student_id' + appendedFilters + statusFilter, nestTables: true };
				con.query(options, function (err, results, fields) {
					    var nestingOptions = [
							{ tableName : 'team', pkey: 'team_id'},
							{ tableName : 'students_in_teams', pkey: 'student_id', fkeys:[{table:'team',col:'team_id'},{table:'student',col:'student_id'}]},
							{ tableName : 'student', pkey: 'student_id'}
						];
						var nestedResults = mysql_nest.convertToNested(results, nestingOptions);
					con.release();
					resolve(nestedResults);
				});
			});
		});
    };
}

module.exports = new Teams();
