previousProposalSelection = null;

//Requests an HTML document and loads it into the proposal section.
function getContent(id, div, template, isMenu) {
  loadingDisplay(div);
  var isIdExist = false;
  if (id != null) {
	template = template + "?id=" + id;
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
  xmlhttp.open("GET", template ,true);
  xmlhttp.send();
}

var app_name;

function grabProjectList() {
	getContent(null, 'projects-view', 'project-list', false);
}

function searchProjects() {
	var searchQuery = document.getElementById("sch-bar").value;
	getContent(null, 'projects-view', 'project-list?query=' + searchQuery, false);
}



function openProject(id, name) {
	document.getElementById("projects-section").style.display = "none";
	document.getElementById("project-information").style.display = "block";
	getContent(id, 'project-information', 'project', false);
	app_name = document.getElementById("app-name").innerHTML;
	document.getElementById("app-name").innerHTML = "<a href='#' onclick='closeProject()'>Back</a>";
}

function closeProject() {
	document.getElementById("projects-section").style.display = "block";
	document.getElementById("project-information").style.display = "none";
	document.getElementById("app-name").innerHTML = app_name;
}

function proposaldeclineForm() {
	document.getElementById("prop-action-bar").style.display = "none";
	document.getElementById("prop-decline-bar").style.display = "block";
	document.getElementById("proposal-wrapper").style.height = "calc(100% - 160px)";
}

function proposalAccept() {
	document.getElementById("proposal-wrapper").style.height = "100%";
	document.getElementById("proposal-content").style.filter = "blur(3px)";
	document.getElementById("prop-action-bar").style.display = "none";
	document.getElementById("proposal-confirmation").style.display = "block";
	document.getElementById('proposal-confirmation').scrollIntoView();
}

function rejectCancel() {
	document.getElementById("prop-action-bar").style.display = "block";
	document.getElementById("prop-decline-bar").style.display = "none";
	document.getElementById("proposal-wrapper").style.height = "calc(100% - 36px)";
}

function approveCancel() {
	document.getElementById("prop-action-bar").style.display = "block";
	document.getElementById("proposal-content").style.filter = "none";
	document.getElementById("proposal-confirmation").style.display = "none";
	document.getElementById("proposal-wrapper").style.height = "calc(100% - 36px)";
}
