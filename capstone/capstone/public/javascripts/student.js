function teamReadyCheckToggle() {
	toggleElement("teamReadyInfoContent");
}

function joinTeam(team_id) {
	window.location.href = '/jointeam?team_id=' + team_id;
}

function confirmJoinTeam(team_name) {
	toggleElement("send-request-confirm");
	document.getElementById("request-confirm-name").innerHTML = "Sending join request to " + team_name;
}
var isApproved;
function actionAllocation(isApprove) {
	isApproved = isApprove;
	var tempAllocText;
	if (isApprove) {
		tempAllocText = "approve"
	} else {
		tempAllocText = "decline"
	}
	document.getElementById("tempAllocOption").innerHTML = tempAllocText;
	document.getElementById("project-information").style.display = "none";
	toggleElement("action-allocation");
	//document.getElementById("request-confirm-name").innerHTML = "Sending join request to " + team_name;
}

function allocOptionCancel() {
	toggleElement("action-allocation");
	document.getElementById("project-information").style.display = "block";
}

function confirmCancel() {
	toggleElement("send-request-confirm");
}

function allocOptionAccept() {
	document.getElementById("action-allocation").style.display = "none";
	document.getElementById("project-information").style.display = "none";
	document.getElementById("students-view").style.display = "block";
	getContent(null, 'content', 'action-project?is_accept=' + isApproved, false);
}

var teamName;

function openTeamProject() {
	document.getElementById("students-view").style.display = "none";
	document.getElementById("project-information").style.display = "block";
	getContent(null, 'project-information', 'project', false);
	teamName = document.getElementById("app-name").innerHTML;
	document.getElementById("app-name").innerHTML = "Preliminary Assigned Project - <a href='#' onclick='closeTeamProject()'>Back</a>";
}

function closeTeamProject() {
	document.getElementById("project-information").style.display = "none";
	document.getElementById("students-view").style.display = "block";
	document.getElementById("app-name").innerHTML = teamName;
}

function actionJoinRequest(isApproved, studentId) {
	getContent(null, 'content', 'action-joinrequest?is_accept=' + isApproved + "&student=" + studentId, false);
}