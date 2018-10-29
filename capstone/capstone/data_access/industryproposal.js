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
		  console.log(proposal);
        // initialize database connection
        connection.init();
        // calling acquire methods and passing callback method that will be execute query
        // return response to server
        connection.acquire(function (err, con) {
		var pendingVal = 'Pending';
		var options = { sql: 'INSERT INTO project (company_name, project_name, industry, description, liaison_accepted, academic_accepted, partner_accepted, team_accepted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)' };
        con.query(options, [proposal.company_name, proposal.project_name, proposal.industry, proposal.description, pendingVal,pendingVal,pendingVal, pendingVal], function (error, response) {
          if (error) console.log(error);
			
          });
          var project_id;

          // get ID of project and insert into new row of project_contacts
          options = { sql: "SELECT project_id FROM project WHERE project_name = ?"}
          con.query(options, [proposal.project_name], function(err, results, fields){
            project_id = results[0].project_id;
            console.log(project_id);

            options = { sql: "INSERT INTO project_contacts (project_id) VALUES (?)"};
            con.query(options, [project_id], function (error, response){
              if (error) console.log(error);
            })
          })
		  // Add each skill into the project
			for (var i = 0; i < proposal.skills.length; i++) {
				var skill = proposal.skills[i];
				var skillReq = 0;
				if (skill.req) {
					var skillReq = 1;
				}
				var options = { sql: "SELECT * FROM project_skills WHERE project_id = ? AND skill = ?" };
				con.query(options, [project_id, skill.skill], (function(skill, skillReq){ return function (err, results, fields) {
					console.log(results);
					console.log(results.length);
					if (results.length == 0) {
						console.log(skill);
						var optionsInsert = { sql: "INSERT INTO project_skills (project_id, skill, required) VALUES (?, ?, ?)" };
						con.query(optionsInsert, [project_id, skill.skill, skillReq], function (error, response ) {
							console.log(response);
							if (error) console.log(error);
						});
					}
				};})(skill, skillReq));
			}
			con.release();
			resolve(true);
        });
      });
    }
	
	  	// Set skills for a project.
    this.registerProjectSkills = function (skills, projectId) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				for (var i = 0; i < skills.length; i++) {
					var skill = skills[i];
					var options = { sql: "SELECT * FROM project_skills WHERE project_id = ? AND skill = ?" };
					con.query(options, [projectId, skill], (function(skill){ return function (err, results, fields) {
						console.log(results);
						console.log(results.length);
						if (results.length == 0) {
							console.log(skill);
							var optionsInsert = { sql: "INSERT INTO project_skills (project_id, skill) VALUES (?, ?)" };
							con.query(optionsInsert, [projectId, skill], function (error, response ) {
								console.log(response);
								if (error) console.log(error);
							});
						}
					};})(skill));
				}
				con.release();
				resolve(true);
			});
		});
	}

      this.getAllPendingPartners = function(){
        return new Promise(function(resolve, reject) {
          connection.init();
          connection.acquire(function (err, con) {
            var options = { sql: "SELECT * FROM project LEFT JOIN project_contacts ON project_contacts.project_id = project.project_id WHERE project_contacts.first_name IS NULL OR project_contacts.last_name IS NULL OR project_contacts.phone IS NULL OR project_contacts.email IS NULL" };

          con.query(options, function (err, results, fields) {
            var nestingOptions = [
            { tableName : 'project', pkey: 'project_id'},
            { tableName : 'project_contacts', pkey: 'project_id', fkeys:[{table:'project',col:'project_id'}]},

          ];
          var nestedResults = mysql_nest.convertToNested(results, nestingOptions);

          resolve(results);
          con.release();
                });
          });
        });
      };

      this.checkUpdatedDetails = function(id){
              return new Promise(function(resolve, reject) {
                connection.init();
                connection.acquire(function (err, con) {
                  var options = { sql: "SELECT * FROM project_contacts WHERE project_id =? AND first_name IS NOT NULL AND last_name IS NOT NULL AND phone IS NOT NULL AND email IS NOT NULL" };

                con.query(options, [id],function (err, results, fields) {
                resolve(results);
                con.release();
                      });
                });
              });
            };

      this.getProject = function(id){
        return new Promise(function(resolve, reject) {
          connection.init();
          connection.acquire(function (err, con) {
          var options = { sql: "SELECT * FROM project WHERE project_id = ?" };
          con.query(options, [id], function (err, results, fields) {
            console.log(results)
            resolve(results);
            con.release();
          });
        });
      });
    };

    this.updateDetails = function(id, details){
      return new Promise(function(resolve, reject) {
        connection.init();
        connection.acquire(function (err, con) {
        var options = { sql: 'UPDATE project_contacts SET first_name=?, last_name=?, phone=?, email=? WHERE project_id = ?' };
        con.query(options, [details.first_name, details.last_name, details.phone, details.email, id], function (error, response) {
          if (error) resolve(false);
          resolve(true);
          con.release();
        });
      });
    });
  };
  
	this.updateProjectDetails = function(id, details){
      return new Promise(function(resolve, reject) {
        connection.init();
        connection.acquire(function (err, con) {
        var options = { sql: 'UPDATE project SET project_output_type=?, notes=?, scope_deliverables=?, company_type=?, potential_support_level=?, ip_contract_requirement=?, academic_needed=?, repeat_partner=?, preferred_course_combination=?, priority=?, difficulty=? WHERE project_id = ?' };
        con.query(options, [details.project_output_type, details.notes, details.scope_deliverables, details.company_type, details.potential_support_level, details.ip_contract_requirement, details.academic_needed, details.repeat_partner, details.preferred_course_combination, details.priority, details.difficulty, id], function (error, response) {
          if (error) resolve(false);
          resolve(true);
          con.release();
        });
      });
    });
  };
}

module.exports = new IndustryProposal();
