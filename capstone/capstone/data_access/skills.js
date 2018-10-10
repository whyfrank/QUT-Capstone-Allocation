//methods for fetching mysql data
var connection = require('../connection/db');

//methods for nesting mysql data
var mysql_nest = require('../connection/mysql_nest');

function Skills() {
	this.getSkills = async function(){
		return new Promise(function(resolve, reject) {
			connection.init();
			connection.acquire(function (err, con) {
				var options = { sql: 'SELECT * FROM skills' };
				con.query(options, function (err, results, fields) {
				resolve(results);
				con.release();
				});
			});
		});
	};
	
	this.getSkillCategories = async function(){
		return new Promise(function(resolve, reject) {
			connection.init();
			connection.acquire(function (err, con) {
				var options = { sql: 'SELECT DISTINCT skill_type FROM skills' };
				con.query(options, function (err, results, fields) {
				resolve(results);
				con.release();
				});
			});
		});
	};
}
module.exports = new Skills();
