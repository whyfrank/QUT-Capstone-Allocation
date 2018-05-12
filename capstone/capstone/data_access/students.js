//methods for fetching mysql data
var connection = require('../connection/db');

function Students() {

    // get all users data
    this.getAllStudents = function () {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				con.query('SELECT DISTINCT * FROM students', function (err, results, fields) {
					con.release();
					//console.log(result);
					resolve(results);
				});
			});
		});
    };

}

module.exports = new Students();
