function teamReadyCheckToggle() {
	toggleElement("teamReadyInfoContent");
}

function joinTeam(team_id) {
	getContent(null, 'app', 'jointeam?team_id=' + team_id, false);
}

function confirmJoinTeam(team_name) {
	toggleElement("send-request-confirm");
	document.getElementById("request-confirm-name").innerHTML = "Sending join request to " + team_name;
}

function confirmCancel() {
	toggleElement("send-request-confirm");
}