//methods for providing security features
var security = require('../utils/security');

//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Login() {

    // get all users data
    this.staffLogin = function (useremail, userpw) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: 'SELECT * FROM staff WHERE qut_email = ?' };
				con.query(options, [useremail], function (err, results, fields) {
					con.release();

					// Check if a user account has been matched with the QUT email.
					if (results.length > 0){
						var userDetails = results[0];

						// Return the user account details if the entered password equals to the account password.
						if (userpw == userDetails.password) {
							resolve(userDetails);
						} else {
							resolve(false);
						}
					} else {
						resolve(false);
					}
				});
			});
		});
    };



    // get all users data
    this.studentLogin = function (useremail, userpw) {
    return new Promise(function(resolve, reject) {
      // initialize database connection
      connection.init();
      // calling acquire methods and passing callback method that will be execute query
      // return response to server
      connection.acquire(function (err, con) {
        var options = { sql: 'SELECT * FROM students WHERE qut_email = ?' };
        con.query(options, [useremail], function (err, results, fields) {
          con.release();

          // Check if a user account has been matched with the QUT email.
          if (results.length > 0){
            var userDetails = results[0];

            // Return the user account details if the entered password equals to the account password.
            if (userpw == userDetails.password) {
              resolve(userDetails);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        });
      });
    });
    };
}



  module.exports = new Login();
