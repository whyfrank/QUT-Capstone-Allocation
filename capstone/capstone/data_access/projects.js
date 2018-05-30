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
		var appendedFilters = " ";
		if (query.query != null) {
			appendedFilters = appendedFilters + "AND project.project_name LIKE '%" + query.query + "%'";
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
						for (var i = 0; i < nestedResults.length; i++) {
							console.log(query.not_yet_assigned);
							if (query.declined == 'false' && (nestedResults[i].partner_accepted == 'Declined' || nestedResults[i].team_accepted == 'Declined')) {
								delete nestedResults[i];
							}
							else if (query.assigned == 'false' && (nestedResults[i].partner_accepted == 'Approved' && nestedResults[i].team_accepted == 'Approved')) {
								delete nestedResults[i];
							}
							else if (query.preliminary_assignment == 'false' && ((nestedResults[i].partner_accepted == 'Pending' || nestedResults[i].team_accepted == 'Pending') && nestedResults[i].allocated_team != null)) {
								delete nestedResults[i];
							}
							else if (query.not_yet_assigned == 'false' && nestedResults[i].allocated_team == null) {
								delete nestedResults[i];
							}
						}
					con.release();
					resolve(nestedResults);
				});
			});
		});
    };

	// get all proposals data
    this.getAllProposals = function () {
		return new Promise(function(resolve, reject) {
			// initialize database connection
			connection.init();
			// calling acquire methods and passing callback method that will be execute query
			// return response to server
			connection.acquire(function (err, con) {
				var options = { sql: projectBareSql + " WHERE liaison_accepted = 'Approved' AND academic_accepted = 'Pending'", nestTables: true };
				con.query(options, function (err, results, fields) {
					con.release();
					resolve(results);
				});
			});
		});
    };

		// Set a proposal as either approved or declined.
    this.actionProposal = function (id, isApproved) {
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
				var options = { sql: "UPDATE project SET academic_accepted = ? WHERE project_id = ?", nestTables: true };
				con.query(options, [state, id], function (err, results, fields) {
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
}

module.exports = new Projects();
