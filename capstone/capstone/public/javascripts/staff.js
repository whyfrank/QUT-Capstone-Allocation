previousProposalSelection = null;

//Requests an HTML document and loads it into the proposal section.
function getContent(id, div, template, isMenu, concatQuery) {
  loadingDisplay(div);
  var isIdExist = false;
  if (id != null) {
	template = template + "?id=" + id;
  }
  if (concatQuery != null) {
	 template = template + concatQuery; 
  }

  if (isMenu) {
	  if (previousProposalSelection	!= null) {
		previousProposalSelection.setAttribute("style","");
	  }

	  document.getElementById(id).style.background = "#555"
	  document.getElementById(id).style.color = "#fff"
	  previousProposalSelection = document.getElementById(id);
  }

  if (window.XMLHttpRequest) {
	// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
  } else {  // code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
	// If the response is ready, and OK, then display the results in the contents section.
	if (this.readyState==4 && this.status==200) {
	  // Does nothing but show the loading screen for debugging purposes.
	  sleep(300);
	  document.getElementById(div).innerHTML=this.responseText;
	} else if (this.readyState==4 && this.status==404) {
	  document.getElementById(div).innerHTML="<h2>This resource cannot be found: Error " + this.status + ".</h2>";
	} else if (this.readyState==4) {
	  document.getElementById(div).innerHTML="<h2>An error has occured: Error " + this.status + ".</h2>";
	}
  }
	console.log(template)
	xmlhttp.open("GET", template ,true);
	xmlhttp.send();
}

var app_name;

// Gets all projects and displays it in the list.
function grabProjectList() {
	var milestones = document.getElementsByName("milestone");
	var milestoneQueries = "&";
	for (let milestone of milestones) {
		milestoneQueries = milestoneQueries + milestone.value + "=" + milestone.checked + "&";
	}
	
	var searchQuery = document.getElementById("sch-bar").value;
	getContent(null, 'projects-view', 'project-list?query=' + searchQuery + milestoneQueries, false);
}



// Searches for a project based on the input search query.
function searchProjects() {
	grabProjectList();
}

function searchProjectByMilestone() {
	var milestones = document.getElementsByName("milestone");
	var queries = "?";
	for (let milestone of milestones) {
		queries = queries + milestone.value + "=" + milestone.checked + "&";
	}
	
	getContent(null, 'projects-view', 'project-list', false, queries);
}

var project_id;

// Displays the individual project section, and inserts the project HTML page into the app view.
function openProject(id, name) {
	document.getElementById("projects-section").style.display = "none";
	document.getElementById("project-information").style.display = "block";
	getContent(id, 'project-information', 'project', false);
	app_name = document.getElementById("app-name").innerHTML;
	document.getElementById("app-name").innerHTML = name + " - <a href='#' onclick='closeProject()'>Back</a>";
	project_id=id;
}

// Displays the allocation system inside the individual project section, and inserts the project HTML page into the app view.
function allocateProject(id, name) {
	document.getElementById("projects-section").style.display = "none";
	document.getElementById("project-information").style.display = "block";
	getContent(id, 'project-information', 'project-allocation', false);
	app_name = document.getElementById("app-name").innerHTML;
	document.getElementById("app-name").innerHTML = "Allocation - <a href='#' onclick='closeProject()'>Back</a>";
	project_id=id;
}

// Hides the individual project section if the user closes the project.
function closeProject() {
	document.getElementById("projects-section").style.display = "block";
	document.getElementById("project-information").style.display = "none";
	document.getElementById("app-name").innerHTML = app_name;
}

// Displays the decline form for a proposal.
function proposaldeclineForm() {
	document.getElementById("prop-action-bar").style.display = "none";
	document.getElementById("prop-decline-bar").style.display = "block";
	document.getElementById("proposal-wrapper").style.height = "calc(100% - 160px)";
}

// Displays a confirmation message to either accept, or reject the proposal.
function proposalDisplayConfirm(isAccept) {
	document.getElementById("proposal-wrapper").style.height = "100%";
	document.getElementById("proposal-content").style.filter = "blur(3px)";
	document.getElementById("prop-action-bar").style.display = "none";
	if (isAccept) {
		document.getElementById("action-name").innerHTML = "Approve";
		isApproved = 'true';
	} else {
		document.getElementById("action-name").innerHTML = "Decline";
		isApproved = 'false';
	}
	document.getElementById("proposal-confirmation").style.display = "block";
	document.getElementById('proposal-confirmation').scrollIntoView();
}

var isApproved;

// Requests to accept or decline when the user has either confirmed, or declined a proposal.
function proposalConfirm(id) {
	getContent(id, 'proposal-wrapper', 'action_proposal', false, '&state=' + isApproved);
}

// Returns the layout to normal if the user decides not to decline the proposal.
function rejectCancel() {
	document.getElementById("prop-action-bar").style.display = "block";
	document.getElementById("prop-decline-bar").style.display = "none";
	document.getElementById("proposal-wrapper").style.height = "calc(100% - 36px)";
}

// Returns the layout to normal if the user decides not to accept the proposal.
function approveCancel() {
	document.getElementById("prop-action-bar").style.display = "block";
	document.getElementById("proposal-content").style.filter = "none";
	document.getElementById("proposal-confirmation").style.display = "none";
	document.getElementById("proposal-wrapper").style.height = "calc(100% - 36px)";
}

function toggleElement(element_id) {
	if (document.getElementById(element_id).style.display != "none") {
		document.getElementById(element_id).style.display = "none";
		return false;
	} else {
		document.getElementById(element_id).style.display = "block";
		return true;
	}
}

// Allocation System

// Gets all allocation data and displays it in the list.
function grabAllocation(projectId) {
	var teamMatches = document.getElementById("no_of_matches").value;
	var strictCombo = document.getElementById("strict_coursecombo").checked;
	var sort = document.getElementById("sort");
	var sortValue = sort.options[sort.selectedIndex].value;
	var queries = '?id=' + projectId + '&no_of_matches=' + teamMatches + '&strict_coursecombo=' + strictCombo + '&sort=' + sortValue;
	getContent(null, 'project-information', 'project-allocation' + queries, false);
}

function allocateTeam(teamId, projectId) {
	document.getElementById('alloc-finalize').style.display = 'block';
	var queries = '?teamId=' + teamId + '&projectId=' + projectId;
	getContent(null, 'alloc-finalize', 'allocation-finalize' + queries, false);
}

function microsoftAuthenticateAlloc(outlook_authenticate) {
	var win = window.open(outlook_authenticate, '_blank');
	win.focus();
	
	document.getElementById('continue-message').style.display = 'block';
	document.getElementById('login-msft').style.display = 'none';
	document.getElementById('login-next').style.display = 'block';
}

var allocSettingsOpen = false;
function toggleAllocationSettings() {
	if (allocSettingsOpen) {
		allocSettingsOpen = false;
	}
}