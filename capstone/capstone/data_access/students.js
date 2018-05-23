//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Students() {

    // get all users data
    this.getAllStudents = function (query) {
		var appendedFilters = " ";
		if (query.query != null) {
  			appendedFilters = appendedFilters + "AND students.first_name LIKE '%" + query.query + "%'";
  		}
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
        var options = { sql: 'SELECT * FROM students LEFT JOIN students_in_teams ON students_in_teams.student_id = students.student_id LEFT JOIN team ON students_in_teams.team_id = team.team_id' + appendedFilters, nestTables: true };
				con.query(options, function (err, results, fields) {
					    var nestingOptions = [
							{ tableName : 'students', pkey: 'student_id'},
							{ tableName : 'students_in_teams', pkey: 'student_id', fkeys:[{table:'team',col:'team_id'},{table:'student',col:'student_id'}]},
							{ tableName : 'team', pkey: 'team_id'}
						];
						var nestedResults = mysql_nest.convertToNested(results, nestingOptions);
					con.release();
					resolve(results);
				});
			});
		});
    };
}

module.exports = new Students();
