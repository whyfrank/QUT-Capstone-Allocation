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

	  // Does nothing but show the loading screen for debugging purposes.
	  sleep(300);
	  document.getElementById("content").innerHTML=this.responseText;
	  if (app_name == "viewprojects") {
		grabProjectList();
	  } else if (app_name == "viewstudents"){
    grabStudentList();
    } else if (app_name == "viewteams"){
    grabTeamList();
    }
	} else if (this.readyState==4 && this.status==404) {
	  document.getElementById("content").innerHTML="<h2>This resource cannot be found: Error " + this.status + ".</h2>";
	} else if (this.readyState==4) {
	  document.getElementById("content").innerHTML="<h2>An error has occured: Error " + this.status + ".</h2>";
	}
  }
  xmlhttp.open("GET",app_name,true);
  xmlhttp.send();
}

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

function grabStudentList() {
	getContent(null, 'students-view', 'student-list', false);
}

function searchStudents(){
  var searchQuery = document.getElementById("student-sch-bar").value;
  getContent(null, 'students-view', 'student-list?query=' + searchQuery, false);
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
