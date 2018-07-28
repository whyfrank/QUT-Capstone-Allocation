//methods for providing security features
var security = require('../utils/security');

//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Register() {


  // make sure no fields are empty
  // make sure email address contains "qut.edu.au"
  var today = new Date();
  var students={
        "first_name":firstname,
        "last_name":lastname,
        "qut_email":useremail,
        "gpa":gpa,
        "course_code":coursecode,
        "course_title":coursetitle,
        "study_area_a":studyareaa,
        "study_area_b":studyareab,
        "student_id":studentid,
        "password":password
    }



    connection.init();
    connection.query('INSERT INTO students SET ?',students, function (error, response) {
      if (error) {
        console.log("Error: ",error);
      }
    });
  }



module.exports = new Register();
