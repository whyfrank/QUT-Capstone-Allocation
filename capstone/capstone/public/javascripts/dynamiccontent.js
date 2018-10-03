previousMenuSelection = null;

//Requests an HTML document and loads it into the contents section.
function getApp(app_name) {
  if (previousMenuSelection	!= null) {
	previousMenuSelection.setAttribute("style","");
  }

  loadingDisplay("content");
  document.getElementById(app_name).style.background = "#555"
  previousMenuSelection = document.getElementById(app_name);

  if (window.XMLHttpRequest) {
	// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
  } else {  // code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
	// If the response is ready, and OK, then display the results in the contents section.
	if (this.readyState==4 && this.status==200) {
	  document.getElementById("content").innerHTML=this.responseText;
	  if (app_name == "viewprojects") {
		grabProjectList();
	  } else if (app_name == "viewstudents"){
    grabStudentList();
    } else if (app_name == "viewteams"){
    grabTeamList();
    } else if (app_name == "allocation"){
    grabAllocation(false);
    }
	} else if (this.readyState==4 && this.status==404) {
	  document.getElementById("content").innerHTML="<h2>This resource cannot be found: Error " + this.status + ".</h2>";
	}
  }
  xmlhttp.open("GET",app_name,true);
  xmlhttp.send();
}

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

// Draws a loading screen over the element that has content to be loaded.
function loadingDisplay(id) {
	loadingDisplayHTML = '<div class="spinner"></div>';

	document.getElementById(id).innerHTML=loadingDisplayHTML;
}

// Just so I can actually see the loading screen!
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/* STUDENTS functions */

function grabStudentList() {
	getContent(null, 'students-view', 'student-list', false);
}

function searchStudents(){
  var searchQuery = document.getElementById("student-sch-bar").value;
  getContent(null, 'students-view', 'student-list?query=' + searchQuery, false);
}

function getStudentsOnTeams() {
  var radio = document.getElementById("in-team");
  if (radio.checked == true){
    var status = 1;
  } else {
    var status = 0;
  }
  getContent(null, 'students-view', 'student-list?joinedStatus=' + status, false);
}

function getStudentsNotOnTeams() {
  var radio = document.getElementById("not-in-team");
  if (radio.checked == true){
    var status = 1;
  } else {
    var status = 0;
  }
  getContent(null, 'students-view', 'student-list?notJoinedStatus=' + status, false);
}

/* TEAMS functions */

function grabTeamList() {
	getContent(null, 'teams-view', 'team-list', false);
}

function searchTeams(){
  var searchQuery = document.getElementById("team-sch-bar").value;
  getContent(null, 'teams-view', 'team-list?query=' + searchQuery, false);
}

function getTeamsReady() {
  var radio = document.getElementById("teams-formed");
  if (radio.checked == true){
    var status = 1;
  } else {
    var status = 0;
  }
  getContent(null, 'teams-view', 'team-list?readyStatus=' + status, false);
}

function getTeamsNotReady() {
  var radio = document.getElementById("teams-not-formed");
  if (radio.checked == true){
    var status = 1;
  } else {
    var status = 0;
  }
  getContent(null, 'teams-view', 'team-list?notReadyStatus=' + status, false);
}

function toggleElement(element_id) {
	if (document.getElementById(element_id).style.display === "none") {
		document.getElementById(element_id).style.display = "block";
		return false;
	} else if (document.getElementById(element_id).style.display === "block") {
		document.getElementById(element_id).style.display = "none";
		return true;
	} else {
		document.getElementById(element_id).style.display = "block";
		return false;
	}
}
