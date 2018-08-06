const path = require('path');
const fs = require('fs');

var projects_data = require('../data_access/projects');
var teams_data = require('../data_access/teams');

const filePath = "./projectallocations.json";

function ProjectAssign() {
	
	// Main method that calls all the components of the allocation system
	this.generateAllocation = async function () {
		
		// Grab all allocatable projects.
		var allocatableProjects = await grabAllocatableProjects();
		console.log(allocatableProjects);
		
		await exportAllocation(allocatableProjects);
	}
	
	this.retrieveAllocation = async function () {
		var allocation = await importAllocation();
		return allocation;
	}
}

// Returns only projects that can have teams allocated to them.
async function grabAllocatableProjects() {
	await projects_data.getAllProjects().then(function (projects) {
		this.projects = projects;
	})
	
	var allocatableProjects = [];
	
	// Push projects that hasn't been allocated into the allocatable projects array.
	for (var i = 0; i < projects.length; i++) {
		if (projects[i].allocated_team == null) {
			allocatableProjects.push(projects[i]);
		}
	}
	
	return allocatableProjects;
}

// Export the allocation results into a JSON file.
async function exportAllocation(allocatableProjects) {
	var allocation = { name: "Team to Project Allocation", timestamp: new Date().getTime(), projects: allocatableProjects };
	
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