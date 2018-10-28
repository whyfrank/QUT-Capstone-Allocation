//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Projects() {

/*------------------------------------------------------------------------------------------------*/
// These can be joined together to remove repeated code, and simplify query construction.
var projectSql = "SELECT * FROM project";
var projectBareSql = "SELECT project_id, company_name, project_name FROM project";
var projectContactsSql = "project_contacts ON project.project_id = project_contacts.project_id";
var projectSkillsSql = "project_skills ON project_skills.project_id = project.project_id";
var skillsSql = "skills ON project_skills.skill = skills.skill_id";

var joinSql = " LEFT JOIN ";
var teamSql = "team ON team.team_id = project.allocated_team";
var inTeamsSql = "students_in_teams ON team.team_id = students_in_teams.team_id";

var studentsSql = "students ON students_in_teams.student_id = students.student_id";
/*------------------------------------------------------------------------------------------------*/

    // get all projects data
    this.getAllProjects = function (query) {
		var hasQuery = true;
		if (query == undefined) {
			hasQuery = false;
		}
		var appendedFilters = " ";
		if (hasQuery) {
			if (query.query != null) {
				appendedFilters = appendedFilters + "AND project.project_name LIKE '%" + query.query + "%'";
			}
		}
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {

				var options = { sql: projectSql + joinSql + teamSql + joinSql + inTeamsSql + joinSql + studentsSql + " WHERE project.academic_accepted = 'Approved'" + appendedFilters, nestTables: true };
				con.query(options, function (err, results, fields) {
						var nestingOptions = [
							{ tableName : 'project', pkey: 'project_id', fkeys:[{table:'team',col:'allocated_team'}]},
							{ tableName : 'team', pkey: 'team_id'},
							{ tableName : 'students_in_teams', pkey: 'student_id', fkeys:[{table:'team',col:'team_id'},{table:'students',col:'student_id'}]},
							{ tableName : 'students', pkey: 'student_id'}
						];
						var nestedResults = mysql_nest.convertToNested(results, nestingOptions);
						if (hasQuery) {
							// If a particular milestone has been unchecked, delete it from the list of projects to show.
							for (var i = 0; i < nestedResults.length; i++) {
								console.log(query.not_yet_assigned);
								if (query.declined == 'false' && (nestedResults[i].partner_accepted == 'Declined' || nestedResults[i].team_accepted == 'Declined')) {
									delete nestedResults[i];
								}
								else if (query.preliminary_assignment == 'false' && (nestedResults[i].partner_accepted == 'Approved' && nestedResults[i].team_accepted == 'Approved') && nestedResults[i].allocation_finalized != 1) {
									delete nestedResults[i];
								}
								else if (query.awaiting_approval == 'false' && ((nestedResults[i].partner_accepted == 'Pending' || nestedResults[i].team_accepted == 'Pending') && nestedResults[i].allocated_team != null)) {
									delete nestedResults[i];
								}
								else if (query.not_yet_assigned == 'false' && nestedResults[i].allocated_team == null) {
									delete nestedResults[i];
								} else if (query.assigned == 'false' && nestedResults[i].allocation_finalized == 1) {
									delete nestedResults[i];
								}
							}
						}
					con.release();
					resolve(nestedResults);
				});
			});
		});
    };

  // get all proposals data
    this.getAllProposals = function (staff_type) {
    return new Promise(function(resolve, reject) {
      // initialize database connection
      connection.init();
      // calling acquire methods and passing callback method that will be execute query
      // return response to server
      var sqlquery;
      if (staff_type == "industry"){
        sqlquery = "SELECT * FROM project WHERE liaison_accepted = 'Pending' AND academic_accepted = 'Pending'";
      } else if (staff_type == "staff"){
        sqlquery = "SELECT * FROM project WHERE liaison_accepted = 'Approved' AND academic_accepted = 'Pending'";
      }
      connection.acquire(function (err, con) {
        var options = { sql: sqlquery, nestTables: true };
        con.query(options, function (err, results, fields) {
          con.release();
          resolve(results);
        });
      });
    });
    };

		// Set a project as either approved or declined.
    this.actionProject = function (id, isApproved, staffType) {
		var userAccepted;
		if (staffType == "staff") {
			userAccepted = "academic_accepted"
		} else if (staffType == "student") {
			userAccepted = "team_accepted"
		} else if (staffType == "industry"){
			userAccepted = "liaison_accepted"
		} else if (staffType == "partner") {
			userAccepted = "partner_accepted"
		}
    

		var state = 'Declined';
		if (isApproved == 'true') {
			state = 'Approved';
		}
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: "UPDATE project SET " + userAccepted + " = ? WHERE project_id = ?", nestTables: true };
				con.query(options, [state, id], function (err, results, fields) {
					con.release();
					resolve(true);
				});
			});
		});
    };
	
	// Finalize an allocation
    this.finalizeAllocation = function (id) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: "UPDATE project SET allocation_finalized = 1 WHERE project_id = ?", nestTables: true };
				con.query(options, [id], function (err, results, fields) {
					con.release();
					resolve(true);
				});
			});
		});
    };

		// get proposal data
    this.getProposal = function (id) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: projectSql + joinSql + projectContactsSql + joinSql + projectSkillsSql + joinSql + skillsSql + " WHERE project.project_id = ?", nestTables: true };
				con.query(options, [id],function (err, results, fields) {
						var nestingOptions = [
							{ tableName : 'project', pkey: 'project_id', fkeys:[{table:'team',col:'allocated_team'}]},
							{ tableName : 'project_contacts', pkey: 'id', fkeys:[{table:'project',col:'project_id'}]},
							{ tableName : 'project_skills', pkey: 'id', fkeys:[{table:'skills',col:'skill'},{table:'project',col:'project_id'}]},
							{ tableName : 'skills', pkey: 'skill_id'}
						];
						var nestedResults = mysql_nest.convertToNested(results, nestingOptions);
					con.release();
					resolve(nestedResults);
				});
			});
		});
    };


		// get project data
    this.getProject = function (id) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: projectSql + joinSql + projectContactsSql + joinSql + projectSkillsSql + joinSql + skillsSql + joinSql + teamSql + joinSql + inTeamsSql + joinSql + studentsSql + "  WHERE project.project_id = ?", nestTables: true };
				con.query(options, [id],function (err, results, fields) {
						var nestingOptions = [
							{ tableName : 'project', pkey: 'project_id', fkeys:[{table:'team',col:'allocated_team'}]},
							{ tableName : 'project_contacts', pkey: 'id', fkeys:[{table:'project',col:'project_id'}]},
							{ tableName : 'project_skills', pkey: 'id', fkeys:[{table:'skills',col:'skill'},{table:'project',col:'project_id'}]},
							{ tableName : 'skills', pkey: 'skill_id'},
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

			// get project data
    this.getTeamProject = function (teamId) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: projectSql + joinSql + projectContactsSql + joinSql + projectSkillsSql + joinSql + skillsSql + joinSql + teamSql + joinSql + inTeamsSql + joinSql + studentsSql + "  WHERE project.allocated_team = ?", nestTables: true };
				con.query(options, [teamId],function (err, results, fields) {
						var nestingOptions = [
							{ tableName : 'project', pkey: 'project_id', fkeys:[{table:'team',col:'allocated_team'}]},
							{ tableName : 'project_contacts', pkey: 'id', fkeys:[{table:'project',col:'project_id'}]},
							{ tableName : 'project_skills', pkey: 'id', fkeys:[{table:'skills',col:'skill'},{table:'project',col:'project_id'}]},
							{ tableName : 'skills', pkey: 'skill_id'},
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

	// Set a team for a project.
    this.allocateProject = function (teamId, projectId) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: "UPDATE project SET allocated_team = ? WHERE project_id = ?", nestTables: true };
				con.query(options, [teamId, projectId], function (err, results, fields) {
					con.release();
					resolve(true);
				});
			});
		});
    };

	// Remove a team from a project.
    this.deallocateProject = function (projectId) {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: "UPDATE project SET allocated_team = NULL, partner_accepted = 'Pending', team_accepted = 'Pending' WHERE project_id = ?", nestTables: true };
				con.query(options, [projectId], function (err, results, fields) {
					con.release();
					resolve(true);
				});
			});
		});
    };
}

module.exports = new Projects();
