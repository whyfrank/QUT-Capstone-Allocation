//methods for fetching mysql data
var connection = require('../connection/db');

function Teams() {

    // get all users data
    this.getAllTeams = function () {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				con.query('SELECT * FROM team', function (err, results, fields) {
					con.release();
					//console.log(result);
					resolve(results);
				});
			});
		});
    };
	
	    // get all users data
    this.getAllStudentsOfTeam = function (team_id) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				con.query('SELECT * FROM students_in_teams WHERE `team_id` = ?', [team_id], function (err, results, fields) {
					con.release();
					//console.log(err);
					resolve(results);
				});
			});
		});
    };
}

module.exports = new Teams();
