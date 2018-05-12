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
				con.query('SELECT DISTINCT * FROM team', function (err, results, fields) {
					con.release();
					//console.log(result);
					resolve(results);
				});
			});
		});
    };

}

module.exports = new Teams();
