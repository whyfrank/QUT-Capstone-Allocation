//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Projects() {

    // get all projects data
    this.getAllProjects = function () {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: 'SELECT * FROM project LEFT JOIN team ON team.team_id = project.allocated_team LEFT JOIN students_in_teams ON team.team_id = students_in_teams.team_id LEFT JOIN students ON students_in_teams.student_id = students.student_id', nestTables: true };
				con.query(options, function (err, results, fields) {
						var nestingOptions = [
							{ tableName : 'project', pkey: 'project_id', fkeys:[{table:'team',col:'allocated_team'}]},
							{ tableName : 'team', pkey: 'team_id'},
							{ tableName : 'students_in_teams', pkey: 'student_id', fkeys:[{table:'team',col:'team_id'},{table:'students',col:'student_id'}]},
							{ tableName : 'students', pkey: 'student_id'}
						];
						var nestedResults = mysql_nest.convertToNested(results, nestingOptions);
					con.release();
					resolve(nestedResults);
				});
			});
		});
    };
}

module.exports = new Projects();
