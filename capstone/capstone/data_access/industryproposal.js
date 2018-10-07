//methods for providing security features
var security = require('../utils/security');

//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function IndustryProposal() {

  this.getDifficulty = function(){
    return new Promise(function(resolve, reject) {
      connection.init();
      connection.acquire(function (err, con) {
        var sqlquery = `
        SELECT TRIM("'" FROM SUBSTRING_INDEX(SUBSTRING_INDEX(
          (SELECT TRIM(')' FROM SUBSTR(column_type, 5)) FROM information_schema.columns
          WHERE table_name = 'project' AND column_name = 'difficulty'),
        ',', @r:=@r+1), ',', -1)) AS item
        FROM (SELECT @r:=0) deriv1,
        (SELECT ID FROM information_schema.COLLATIONS) deriv2
        HAVING @r <=
          (SELECT LENGTH(column_type) - LENGTH(REPLACE(column_type, ',', ''))
          FROM information_schema.columns
          WHERE table_name = 'project' AND column_name = 'difficulty');`;
      var options = { sql: sqlquery };
      con.query(options, function (err, results, fields) {
      resolve(results);
      con.release();
            });
      });
    });
  };


  this.getPriority = function(){
    return new Promise(function(resolve, reject) {
      connection.init();
      connection.acquire(function (err, con) {
        var sqlquery = `
        SELECT TRIM("'" FROM SUBSTRING_INDEX(SUBSTRING_INDEX(
          (SELECT TRIM(')' FROM SUBSTR(column_type, 5)) FROM information_schema.columns
          WHERE table_name = 'project' AND column_name = 'priority'),
        ',', @r:=@r+1), ',', -1)) AS item
        FROM (SELECT @r:=0) deriv1,
        (SELECT ID FROM information_schema.COLLATIONS) deriv2
        HAVING @r <=
          (SELECT LENGTH(column_type) - LENGTH(REPLACE(column_type, ',', ''))
          FROM information_schema.columns
          WHERE table_name = 'project' AND column_name = 'priority');`;
      var options = { sql: sqlquery };
      con.query(options, function (err, results, fields) {
      resolve(results);
      con.release();
            });
      });
    });
  };


  this.getPreferredCourseCombination = function(){
    return new Promise(function(resolve, reject) {
      connection.init();
      connection.acquire(function (err, con) {
        var sqlquery = `
        SELECT TRIM("'" FROM SUBSTRING_INDEX(SUBSTRING_INDEX(
          (SELECT TRIM(')' FROM SUBSTR(column_type, 5)) FROM information_schema.columns
          WHERE table_name = 'project' AND column_name = 'preferred_course_combination'),
        ',', @r:=@r+1), ',', -1)) AS item
        FROM (SELECT @r:=0) deriv1,
        (SELECT ID FROM information_schema.COLLATIONS) deriv2
        HAVING @r <=
          (SELECT LENGTH(column_type) - LENGTH(REPLACE(column_type, ',', ''))
          FROM information_schema.columns
          WHERE table_name = 'project' AND column_name = 'preferred_course_combination');`;
      var options = { sql: sqlquery };
      con.query(options, function (err, results, fields) {
      resolve(results);
      con.release();
            });
      });
    });
  };

  this.submitProposal = function (proposal) {

      return new Promise(function(resolve, reject) {
        // initialize database connection
        connection.init();
        // calling acquire methods and passing callback method that will be execute query
        // return response to server
        connection.acquire(function (err, con) {

			  options = { sql: 'INSERT INTO project (company_name, project_name, industry, description) VALUES (?, ?, ?, ?)' };
              con.query(options, [proposal.companyname, proposal.projectname, proposal.industry, proposal.description], function (error, response) {
                if (error) throw error;
                resolve(true);

				            con.release();
              });
            });
        });
      }
    }

module.exports = new IndustryProposal();
