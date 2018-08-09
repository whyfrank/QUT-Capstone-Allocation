const path = require('path');
const fs = require('fs');

var projects_data = require('../data_access/projects');
var teams_data = require('../data_access/teams');

const filePath = "./projectallocations.json";
const TOP_MATCHES = 5;

var allocatableProjects;
var allocatableTeams;

function ProjectAssign() {

	// Main method that calls all the components of the allocation system
	this.generateAllocation = async function () {
		
		// Grab all allocatable projects.
		allocatableProjects = await grabAllocatableProjects();
		console.log(allocatableProjects);
		
		allocatableTeams = await grabAllocatableTeams();
		
		for (var i = 0; i < allocatableProjects.length; i++) {
			var teamMatches = await getBestTeamMatch(TOP_MATCHES, i);
			allocatableProjects[i].team_matches = teamMatches;
		}
		
		await exportAllocation(allocatableProjects, allocatableTeams);
	}
	
	this.retrieveAllocation = async function () {
		var allocation = await importAllocation();
		return allocation;
	}
}

async function getBestTeamMatch(count, index) {
	var project = allocatableProjects[index];
	var allTeams = [];

	var totalSkillCount = project.project_skills.length;
	
	for (var i = 0; i < allocatableTeams.length; i++) {
		var team = allocatableTeams[i];
		// process skills
		var matchedSkills = [];
		
		// Get each skill from project
		for (var skill_i = 0; skill_i < totalSkillCount; skill_i++) {
			// Check it against each skill from team
			for (var t_skill_i = 0; t_skill_i < totalSkillCount; t_skill_i++) {
				// If the skills match, then add the skill into the matched skills array.
				if (team.team_skills[t_skill_i] == project.project_skills[skill_i].skill) {
					matchedSkills.push(project.project_skills[skill_i]);
				}
			}
		}
		var skill_match_percentage = (matchedSkills.length / totalSkillCount) * 100;
		
		allTeams.push({team_id: team.team_id, team_name: team.team_name, matched_skills: matchedSkills, matched_skills_percentage: skill_match_percentage});
	}

	
	return allTeams;
}

// Returns only projects that can have teams allocated to them.
async function grabAllocatableProjects() {
	await projects_data.getAllProjects().then(function (projects) {
		this.projects = projects;
	})
	
	var allocatableProjects = [];
	
	// Push projects that hasn't been allocated into the allocatable projects array.
	for (var i = 0; i < projects.length; i++) {
		// Only pull projects with no teams allocated
		if (projects[i].allocated_team == null) {
			
			// Grab the full project with skills.
			await projects_data.getProject(projects[i].project_id).then(function (project) {
				this.project = project[0];
				console.log(this.project);
				
				// Clean unnecessary details
				delete this.project.project_contacts;
			})
			allocatableProjects.push(this.project);
		}
	}
	
	return allocatableProjects;
}

// Returns only teams that haven't been allocated to projects.
async function grabAllocatableTeams() {
	await teams_data.getAllTeams().then(function (teams) {
		this.teams = teams;
	})
	
	var allocatableTeams = [];
	
	//TODO: Reverse search teams by writing an SQL query to see if any rows in projects have the current team as allocated.
	
	// Push projects that hasn't been allocated into the allocatable projects array.
	for (var i = 0; i < teams.length; i++) {
		/*// Only pull teams with no projects allocated
		if (projects[i].allocated_team == null) {*/
			var team = teams[i];
		
			// Combine all unique skill sets
			var team_skills = [];
			
			var team_students = team.students_in_teams;
			
			// Get skills from each student
			for (var stud_i = 0; stud_i < team_students.length; stud_i++) {
				
				// Only add skills if the student has skills
				if (team_students[stud_i].students.student_skills != undefined) {
					var stud_skills = team_students[stud_i].students.student_skills;
					
					// For each student skill, check if it already exists as a team skill.
					for (var skill_i = 0; skill_i < stud_skills.length; skill_i++) {
						var addSkill = true;
						for (var t_skill_i = 0; t_skill_i < team_skills.length; t_skill_i++) {
							
							// Do not add the skill if there is already the same skill in the team skills array.
							if (team_skills[t_skill_i] == stud_skills[skill_i].skill) {
								addSkill = false;
							}
						}
						
						// Add the skill if the pre-rerequisites were achieved.
						if (addSkill) {
							team_skills.push(stud_skills[skill_i].skill);
						}
					}
				}
			}
			
			allocatableTeams.push({team_id: team.team_id, team_name: team.team_name, team_skills: team_skills});
		/*}*/
	}
	
	return allocatableTeams;
}

// Export the allocation results into a JSON file.
async function exportAllocation(allocatableProjects, allocatableTeams) {
	var allocation = { name: "Team to Project Allocation", timestamp: new Date().getTime(), projects: allocatableProjects, teams: allocatableTeams };
	
	var content = JSON.stringify(allocation, null, 4);
	
	fs.writeFile(filePath, content, 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}

		console.log("The allocation JSON file was saved!");
	}); 
}

// Import the allocation results from a JSON file.
async function importAllocation() {
	if(fs.existsSync(filePath)) {
	    var allocation = JSON.parse(await fs.readFileSync(filePath, 'utf8'));
		return allocation;
	} else {
		console.log("Local allocation results not found.");
		return false;
	}
}

module.exports = new ProjectAssign();