//methods for providing security features
var security = require('../utils/security');

//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Register() {


  // make sure no fields are empty
  // make sure email address contains "qut.edu.au"
  // validate using JOI or html "required" ?

  this.registerStudent = function (student) {

    if(student.password != "" && student.password == student.confirmpassword) {
      if(student.password < 6) {
        alert("Error: Password must contain at least six characters!");
        student.password.focus();
        return false;
      }
      re = /[0-9]/;
      if(!re.test(student.password)) {
        alert("Error: password must contain at least one number (0-9)!");
        student.password.focus();
        return false;
      }
      re = /[a-z]/;
      if(!re.test(student.password)) {
        alert("Error: password must contain at least one lowercase letter (a-z)!");
        student.password.focus();
        return false;
      }
      re = /[A-Z]/;
      if(!re.test(student.password)) {
        alert("Error: password must contain at least one uppercase letter (A-Z)!");
        student.password.focus();
        return false;
      }
    }

      //CHECK IF EMAIL ALREADY EXISTS
      return new Promise(function(resolve, reject) {
        // initialize database connection
        connection.init();
        // calling acquire methods and passing callback method that will be execute query
        // return response to server
        connection.acquire(function (err, con) {
          var options = { sql: 'SELECT * FROM students WHERE qut_email = ?' };
          con.query(options, [student.qut_email], function (err, results, fields) {
            con.release();

            // Check if a user account has been matched with the QUT email.
            if (results.length > 0){
              resolve(false);
            } else {
              // ADD STUDENT INTO DATABASE
              connection.query('INSERT INTO students',student, function (error, response) {
                if (err) throw err;
                res.send('Save succesfull');
              });
            }
        });
      });
    }
  }
}
module.exports = new Register();
