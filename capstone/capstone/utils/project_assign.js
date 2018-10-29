const path = require('path');
const fs = require('fs');

var projects_data = require('../data_access/projects');
var teams_data = require('../data_access/teams');

const filePath = "./projectallocations.json";

var allocatableTeams;

function ProjectAssign() {

	// Main method that calls all the components of the allocation system
	this.generateAllocation = async function (project_id, settings) {
		
		// Grab all allocatable projects.
		allocatableProject = await grabAllocatableProject(project_id);
		console.log(allocatableProject);
		
		allocatableTeams = await grabAllocatableTeams();
		console.log(allocatableTeams);
		
		var teamMatches = await getBestTeamMatch(settings, allocatableProject);
		allocatableProject.team_matches = teamMatches;

		return allocatableProject;
	}
}

async function getBestTeamMatch(settings, project) {
	var allTeams = [];

	var totalSkillCount = project.project_skills.length;
	
	for (var i = 0; i < allocatableTeams.length; i++) {
		var team = allocatableTeams[i];
		// process skills
		var matchedSkills = [];
		var unmatchedSkills = [];
		
		var matchedNonReqSkills = [];
		var unmatchedNonReqSkills = [];
		
		// Get each skill from project
		for (var skill_i = 0; skill_i < totalSkillCount; skill_i++) {
			var projectSkill = project.project_skills[skill_i];
			// Check it against each skill from team
			skillMatched = false;
			for (var t_skill_i = 0; t_skill_i < totalSkillCount; t_skill_i++) {
				// If the skills match, then add the skill into the matched skills array.
				if (team.team_skills[t_skill_i] == projectSkill.skill) {
					// Determine if the skill is mandatory (required), then add it to matched skills.
					if (projectSkill.required == 1) {
						matchedSkills.push(projectSkill);
					} else {
						matchedNonReqSkills.push(projectSkill);
					}
					skillMatched = true;
				}
			}
			
			// If the skill hasn't matched. Add it to the list of unmatched skills
			if (!skillMatched) {
				if (projectSkill.required == 1) {
					unmatchedSkills.push(project.project_skills[skill_i]);
				} else {
					unmatchedNonReqSkills.push(project.project_skills[skill_i]);
				}
			}
		}
		var skill_match_percentage = (matchedSkills.length / totalSkillCount) * 100;
		
		// Only make the team allocatable if the course combination strictly matches, or if strict course combo is disabled.
		if (settings.strictCourseCombo == true && project.preferred_course_combination != team.course_combination) {
			// Do nothing
		} else {
		allTeams.push({team_id: team.team_id, team_name: team.team_name, matched_skills: matchedSkills, 
			matched_skills_percentage: skill_match_percentage, unmatched_skills: unmatchedSkills, 
			matched_nonreq_skills: matchedNonReqSkills, unmatched_nonreq_skills: unmatchedNonReqSkills, 
			team_gpa: team.team_gpa.toFixed(2), team_min_gpa: team.team_min_gpa, team_max_gpa: team.team_max_gpa,
			student_names: team.student_names, course_combination: team.course_combination, preferred_industry: team.preferred_industry});
		}
	}
	
	if (settings.sort != 'gpa') {
		// Sort by skill match
		allTeams.sort((a, b) => parseFloat(b.matched_skills_percentage) - parseFloat(a.matched_skills_percentage));
		
		if (settings.sort == 'gpa_skills') {
			prunedTeams = allTeams.slice(0, settings.count);
		}
	} else if (settings.sort != 'skills') {
		// Sort by GPA
		allTeams.sort((a, b) => parseFloat(b.team_gpa) - parseFloat(a.team_gpa));
	}
	
	// Reduce the number of allocatable teams to the count specified
	prunedTeams = allTeams.slice(0, settings.count);
	
	return prunedTeams;
}

// Returns the project.
async function grabAllocatableProject(project_id) {
	await projects_data.getProject(project_id).then(function (project) {
		this.project = project[0];
	})
	
	return project;
}

// Returns only teams that haven't been allocated to projects.
async function grabAllocatableTeams() {
	await teams_data.getAllTeams("", false, false).then(function (teams) {
		this.teams = teams;
	})
	console.log(this.teams);
	
	var allocatableTeams = [];
	
	//TODO: Reverse search teams by writing an SQL query to see if any rows in projects have the current team as allocated.
	
	// Push projects that hasn't been allocated into the allocatable projects array.
	for (var i = 0; i < teams.length; i++) {
		
		var team = teams[i];
		// Only pull teams that are ready
		if (team.team_ready == 1) {
			// The team must have no project assigned.
			await projects_data.getTeamProject(team.team_id).then(function (teamProject) {
				if (teamProject.length < 1) {
					// Combine all unique skill sets
					var team_skills = [];
					var team_gpa = 0;
					var team_min_gpa;
					var team_max_gpa;
					var student_names = [];
					var course_combination = "";
					
					var team_students = team.students_in_teams;
					console.log("Team students - " + team.students_in_teams);
					
					// Get information from each student
					for (var stud_i = 0; stud_i < team_students.length; stud_i++) {
						var student = team_students[stud_i].students;
						// Add GPA to total team GPA
						team_gpa += student.gpa
						
						student_names.push(student.first_name + " " + student.last_name);
						
						// Adds first letter of IT study area to course combination
						course_combination += student.study_area_a.charAt(0);
						
						// Check if min or max GPA
						if (student.gpa < team_min_gpa | team_min_gpa == null) {
							team_min_gpa = student.gpa;
						} else if (student.gpa > team_max_gpa | team_max_gpa == null) {
							team_max_gpa = student.gpa;
						}
						
						// Only add skills if the student has skills
						if (student.student_skills != undefined) {
							var stud_skills = student.student_skills;
							
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
					
					// Calculate average GPA
					team_gpa = team_gpa / team_students.length;
					
					// Order course acronyms by their first letter
					course_combination = course_combination.split('');
					course_combination = course_combination.sort();
					course_combination = course_combination.join('');
					
					allocatableTeams.push({team_id: team.team_id, team_name: team.team_name, team_skills: team_skills, 
						team_gpa: team_gpa, team_min_gpa: team_min_gpa, team_max_gpa: team_max_gpa, student_names: student_names, 
						course_combination: course_combination, preferred_industry: team.preferred_industry});
				}
				})
			}
		}
	
	return allocatableTeams;
	}


module.exports = new ProjectAssign();